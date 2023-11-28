import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../server";
import * as db from "../db/donuts-db";
import "./test-setup";
import { bases, glazes } from "../db/seedData.js";
import { Params } from "express-unless";

vi.mock("express-jwt", () => ({
  expressjwt: (_options: Params) => (req, res, next) => {
    if (req.headers.authorization) req.auth = { sub: "hello123" };
    else next(new Error("Unauthorized: No Token"));
    next();
  },
}));

describe("GET /glazes", () => {
  it("Should return an array containing all glazes", async () => {
    const res = await request(app)
      .get("/api/v1/donuts/glazes")
      .expect(200)
      .expect("Content-Type", /json/);

    expect(res.body).toStrictEqual(glazes);
  });

  it("Should return a 500 when the db is down", async () => {
    vi.spyOn(db, "getAllGlazes").mockRejectedValueOnce("ERROR");
    await request(app).get("/api/v1/donuts/glazes").expect(500);
  });
});

describe("GET /bases", () => {
  it("Should return an array containing all bases", async () => {
    const res = await request(app)
      .get("/api/v1/donuts/bases")
      .expect(200)
      .expect("Content-Type", /json/);

    expect(res.body).toStrictEqual(bases);
  });

  it("Should return a 500 when the db is down", async () => {
    vi.spyOn(db, "getAllBases").mockRejectedValueOnce("ERROR");
    await request(app).get("/api/v1/donuts/bases").expect(500);
  });
});

describe("GET /me", () => {
  it("Should return a 401 if no token is present", async () => {
    await request(app).get("/api/v1/donuts/me").expect(401);
  });

  it("Should return a 500 if an error occurs", async () => {
    vi.spyOn(db, "getDonuts").mockRejectedValueOnce("NO DONUTS TODAY");
    await request(app)
      .get("/api/v1/donuts/me")
      .expect(500)
      .set("Authorization", `Bearer 123`);
  });

  it("Should return user values if token is present", async () => {
    const res = await request(app)
      .get("/api/v1/donuts/me")
      .set("Authorization", `Bearer 123`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body).toStrictEqual([
      {
        id: 1,
        auth0_id: "hello123",
        glazeId: 1,
        baseId: 3,
        glazeName: "Chocolate",
        price: 8,
        gold: 0,
        glazeColor: "#7a4e3c",
        baseName: "Milky",
        baseColor: "#fffdf8",
      },
      {
        id: 2,
        auth0_id: "hello123",
        glazeId: 1,
        baseId: 1,
        glazeName: "Chocolate",
        price: 1008,
        gold: 1,
        glazeColor: "#7a4e3c",
        baseName: "Original",
        baseColor: "#e5e0cb",
      },
      {
        id: 5,
        auth0_id: "hello123",
        glazeId: 3,
        baseId: 1,
        glazeName: "Green Tea",
        price: 7,
        gold: 0,
        glazeColor: "#74a12e",
        baseName: "Original",
        baseColor: "#e5e0cb",
      },
    ]);
  });
});

describe("GET /:id", () => {
  it("Should return a donut", async () => {
    const res = await request(app)
      .get("/api/v1/donuts/4")
      .expect(200)
      .expect("Content-Type", /json/);

    expect(res.body).toStrictEqual({
      id: 4,
      auth0_id: "world156",
      glazeId: 2,
      baseId: 1,
      glazeName: "Strawberry",
      gold: 0,
      price: 9,
      glazeColor: "#f57f8e",
      baseName: "Original",
      baseColor: "#e5e0cb",
    });
  });

  it("Should return a 400 if the ID is invalid", async () => {
    const res = await request(app).get("/api/v1/donuts/abcde").expect(400);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it("Should return a 404 if the donut does not exist", async () => {
    const res = await request(app).get("/api/v1/donuts/99").expect(404);
    expect(res.body.message).toMatch(/does not exist/i);
  });

  it("Should return a 500 if an error occurs", async () => {
    vi.spyOn(db, "getDonut").mockRejectedValueOnce("HE HAS BEEN EATEN");
    await request(app).get("/api/v1/donuts/2").expect(500);
  });
});

describe("DELETE /:id", () => {
  it("Should delete a donut", async () => {
    await request(app)
      .delete("/api/v1/donuts/1")
      .set("Authorization", `Bearer 123`)
      .expect(200);

    const donut = await db.getDonut(1);
    expect(donut).toBeUndefined();
  });

  it("Should return a 400 if the ID is invalid", async () => {
    const res = await request(app)
      .delete("/api/v1/donuts/abcde")
      .set("Authorization", `Bearer 123`)
      .expect(400);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it("Should return a 404 if the donut does not exist", async () => {
    const res = await request(app)
      .delete("/api/v1/donuts/99")
      .set("Authorization", `Bearer 123`)
      .expect(404);
    expect(res.body.message).toMatch(/does not exist/i);
  });

  it("Should return a 401 if the user is unauthorized", async () => {
    const res = await request(app).delete("/api/v1/donuts/2").expect(401);
    expect(res.body.message).toMatch(/unauthorized/i);
  });

  it("Should return a 401 if the user id does not match", async () => {
    const res = await request(app)
      .delete("/api/v1/donuts/4")
      .set("Authorization", `Bearer 123`)
      .expect(401);
    expect(res.body.message).toMatch(/unauthorized/i);
  });

  it("Should return a 500 if an error occurs", async () => {
    vi.spyOn(db, "deleteDonut").mockRejectedValueOnce("YOU CANT TAKE HIM");
    await request(app)
      .delete("/api/v1/donuts/2")
      .set("Authorization", `Bearer 123`)
      .expect(500);
    const donutStillExists = await db.getDonut(2);
    expect(donutStillExists).toBeDefined();
  });
});

describe("POST /", () => {
  const donut = { base: 1, glaze: 2, gold: false };

  it("Should add a donut", async () => {
    const res = await request(app)
      .post("/api/v1/donuts/")
      .set("Authorization", `Bearer 123`)
      .send(donut)
      .expect(200);
    expect(res.body).toStrictEqual({
      id: 6,
      base: 1,
      glaze: 2,
      gold: 0,
      auth0_id: "hello123",
    });
  });

  it("Should return a 401 if the user is unauthorized", async () => {
    const res = await request(app)
      .post("/api/v1/donuts/")
      .send(donut)
      .expect(401);
    expect(res.body.message).toMatch(/unauthorized/i);
  });

  it("Should return a 400 if not all details are added", async () => {
    const res = await request(app)
      .post("/api/v1/donuts/")
      .set("Authorization", `Bearer 123`)
      .send({ glaze: 3 })
      .expect(400);
    expect(res.body.message).toMatch(/missing/i);
  });

  it("Should return a 400 if glaze/base values are invalid", async () => {
    await request(app).post("/api/v1/donuts/")
      .set("Authorization", `Bearer 123`)
      .send({ glaze: 20, base: 42 })
      .expect(400);
  });

  it("Should return a 500 if an error occurs", async () => {
    vi.spyOn(db, "insertDonut").mockRejectedValueOnce("NO BAKING ALLOWED");
    await request(app)
      .post("/api/v1/donuts/")
      .set("Authorization", `Bearer 123`)
      .send(donut)
      .expect(500);
  });
});
