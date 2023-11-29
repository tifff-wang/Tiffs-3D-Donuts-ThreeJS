import express from "express";
import * as db from "../db/donuts-db";
// import checkJwt, { JwtRequest } from "../auth0";
import errors from "../lib/errors";
import { verifyToken } from "../auth0";

const router = express.Router();

// Get /api/v1/donuts/flavors

router.get("/glazes", async (req, res) => {
  try {
    const flavorNames = await db.getAllGlazes();
    res.json(flavorNames);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

// Get /api/v1/donuts/bases
router.get("/bases", async (req, res) => {
  try {
    const baseNames = await db.getAllBases();
    res.json(baseNames);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

router.get("/bases/:id", async (req, res) => {
  try {
    const baseId = Number(req.params.id);
    if (isNaN(baseId)) return errors.clientError(req, res, "Invalid Base ID");

    const base = await db.getBase(req.params.id);
    res.json(base);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

router.get("/glazes/:id", async (req, res) => {
  try {
    const glazeId = Number(req.params.id);
    if (isNaN(glazeId)) return errors.clientError(req, res, "Invalid Glaze ID");

    const glaze = await db.getGlaze(glazeId);
    res.json(glaze);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const userId = req.user.sub;
    if (!userId) return errors.unauthorizedError(req, res, "Unauthorized");

    const donuts = (await db.getDonuts(userId))?.map((donut) => ({
      ...donut,
      price: donut.gold ? Number(donut.price) + 1000 : donut.price,
    }));
    res.json(donuts);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const donutId = Number(req.params.id);
    if (isNaN(donutId)) return errors.clientError(req, res, "Invalid Donut ID");

    const donut = await db.getDonut(donutId);
    if (!donut)
      return errors.notFoundError(
        req,
        res,
        `Donut with id ${donutId} does not exist`,
      );
    else
      res.json({
        ...donut,
        price: donut.gold ? Number(donut.price) + 1000 : donut.price,
      });
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

router.post("/", checkJwt, async (req: JwtRequest, res) => {
  try {
    const userId = req.auth?.sub;
    const { base, glaze, gold } = req.body;

    if (!userId) return errors.unauthorizedError(req, res, "Unauthorized");
    // double equal to also check for null
    if (!base || !glaze || gold == undefined)
      return errors.clientError(req, res, "Missing donut properties");

    const donut = (
      await db.insertDonut({ auth0_id: userId, base, glaze, gold })
    )[0];

    res.json(donut);
  } catch (error) {
    // handles sqlite constraint err
    if (error.errno === 19)
      return errors.clientError(req, res, "Invalid request");
    res.sendStatus(500);
    console.error(error);
  }
});

router.delete("/:id", checkJwt, async (req: JwtRequest, res) => {
  try {
    const userId = req.auth?.sub;

    const donutId = Number(req.params.id);
    if (isNaN(donutId)) return errors.clientError(req, res, "Invalid Donut ID");

    const donut = await db.getDonut(donutId);
    if (!donut)
      return errors.notFoundError(
        req,
        res,
        `Donut with id ${donutId} does not exist`,
      );

    if (!userId || donut.auth0_id !== userId)
      return errors.unauthorizedError(req, res, "Unauthorized");
    else await db.deleteDonut(donutId);

    res.status(200).end();
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

export default router;
