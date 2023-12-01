// server/server.ts
import * as Path2 from "node:path";
import express2 from "express";

// server/routes/donuts-routes.ts
import express from "express";

// server/db/connection.ts
import knex from "knex";

// server/db/knexfile.js
import * as Path from "node:path";
import * as URL from "node:url";
var __filename = URL.fileURLToPath(import.meta.url);
var __dirname = Path.dirname(__filename);
var knexfile_default = {
  development: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: Path.join(__dirname, "dev.sqlite3")
    },
    pool: {
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
    }
  },
  test: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: ":memory:"
    },
    migrations: {
      directory: Path.join(__dirname, "migrations")
    },
    seeds: {
      directory: Path.join(__dirname, "seeds")
    },
    pool: {
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
    }
  },
  production: {
    client: "sqlite3",
    connection: {
      filename: "/app/storage/dev.sqlite3"
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
    }
  }
};

// server/db/connection.ts
var environment = process.env.NODE_ENV || "development";
var connection_default = knex(knexfile_default[environment]);

// server/db/donuts-db.ts
function getAllGlazes() {
  const glazes = connection_default("glazes").select();
  return glazes;
}
function getAllBases() {
  const bases = connection_default("bases").select();
  return bases;
}
var getBase = (id) => {
  return connection_default("bases").select().where({ id }).first();
};
var getGlaze = (id) => {
  return connection_default("glazes").select().where({ id }).first();
};
var getDonut = (id) => {
  return connection_default("donuts").select().where({ "donuts.id": id }).select(
    "donuts.id AS id",
    "donuts.auth0_id",
    "donuts.glaze AS glazeId",
    "donuts.gold",
    "donuts.base AS baseId",
    "glazes.name AS glazeName",
    "glazes.price",
    "glazes.color AS glazeColor",
    "bases.name AS baseName",
    "bases.color AS baseColor"
  ).join("glazes", "donuts.glaze", "glazes.id").join("bases", "donuts.base", "bases.id").first();
};
var getDonuts = (auth0Id) => {
  return connection_default("donuts").select(
    "donuts.id AS id",
    "donuts.auth0_id",
    "donuts.glaze AS glazeId",
    "donuts.gold",
    "donuts.base AS baseId",
    "glazes.name AS glazeName",
    "glazes.price",
    "glazes.color AS glazeColor",
    "bases.name AS baseName",
    "bases.color AS baseColor"
  ).where({ auth0_id: auth0Id }).join("glazes", "donuts.glaze", "glazes.id").join("bases", "donuts.base", "bases.id");
};
var insertDonut = (donut) => {
  return connection_default("donuts").insert(donut).returning("*");
};
var deleteDonut = (id) => {
  return connection_default("donuts").delete().where({ id });
};

// server/lib/errors.ts
var clientError = (req, res, message) => res.status(400).json({ message });
var notFoundError = (req, res, message) => res.status(404).json({ message });
var unauthorizedError = (req, res, message) => res.status(401).json({ message });
var errors_default = { clientError, notFoundError, unauthorizedError };

// server/auth0.ts
import { CognitoJwtVerifier } from "aws-jwt-verify";
var poolId = "ap-southeast-2_4bgERYGFZ";
async function verifyToken(req, res, next) {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: poolId,
    tokenUse: "id",
    clientId: "367b7l2k2ho1kbop9eaavnd9b"
  });
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(`headers: ${JSON.stringify(req.headers)}`);
    const payload = await verifier.verify(token);
    console.log(`token is valid with payload: ${payload}`);
    req.user = payload;
  } catch (error) {
    console.log(error);
    console.log("Token not valid");
  }
  next();
}
var auth0_default = verifyToken;

// server/routes/donuts-routes.ts
var router = express.Router();
router.get("/glazes", async (req, res) => {
  try {
    const flavorNames = await getAllGlazes();
    res.json(flavorNames);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});
router.get("/bases", async (req, res) => {
  try {
    const baseNames = await getAllBases();
    res.json(baseNames);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});
router.get("/bases/:id", async (req, res) => {
  try {
    const baseId = Number(req.params.id);
    if (isNaN(baseId))
      return errors_default.clientError(req, res, "Invalid Base ID");
    const base = await getBase(req.params.id);
    res.json(base);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});
router.get("/glazes/:id", async (req, res) => {
  try {
    const glazeId = Number(req.params.id);
    if (isNaN(glazeId))
      return errors_default.clientError(req, res, "Invalid Glaze ID");
    const glaze = await getGlaze(glazeId);
    res.json(glaze);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});
router.get("/me", auth0_default, async (req, res) => {
  console.log("called /me");
  try {
    const userId = req.user.sub;
    if (!userId)
      return errors_default.unauthorizedError(req, res, "Unauthorized");
    const donuts = (await getDonuts(userId))?.map((donut) => ({
      ...donut,
      price: donut.gold ? Number(donut.price) + 1e3 : donut.price
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
    if (isNaN(donutId))
      return errors_default.clientError(req, res, "Invalid Donut ID");
    const donut = await getDonut(donutId);
    if (!donut)
      return errors_default.notFoundError(
        req,
        res,
        `Donut with id ${donutId} does not exist`
      );
    else
      res.json({
        ...donut,
        price: donut.gold ? Number(donut.price) + 1e3 : donut.price
      });
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});
router.post("/", auth0_default, async (req, res) => {
  try {
    const userId = req.user.sub;
    const { base, glaze, gold } = req.body;
    if (!userId)
      return errors_default.unauthorizedError(req, res, "Unauthorized");
    if (!base || !glaze || gold == void 0)
      return errors_default.clientError(req, res, "Missing donut properties");
    const donut = (await insertDonut({ auth0_id: userId, base, glaze, gold }))[0];
    res.json(donut);
  } catch (error) {
    if (error.errno === 19)
      return errors_default.clientError(req, res, "Invalid request");
    res.sendStatus(500);
    console.error(error);
  }
});
router.delete("/:id", auth0_default, async (req, res) => {
  try {
    const userId = req.user.sub;
    const donutId = Number(req.params.id);
    if (isNaN(donutId))
      return errors_default.clientError(req, res, "Invalid Donut ID");
    const donut = await getDonut(donutId);
    if (!donut)
      return errors_default.notFoundError(
        req,
        res,
        `Donut with id ${donutId} does not exist`
      );
    if (!userId || donut.auth0_id !== userId)
      return errors_default.unauthorizedError(req, res, "Unauthorized");
    else
      await deleteDonut(donutId);
    res.status(200).end();
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});
var donuts_routes_default = router;

// server/server.ts
var server = express2();
server.use(express2.json());
server.use("/api/v1/donuts", donuts_routes_default);
server.use((err, req, res, next) => {
  if (!err)
    return;
  console.log(`An error has occurred. ${req.path}: ${err}`);
  if (String(err).match(/unauthorized/gi))
    return errors_default.unauthorizedError(req, res, "Unauthorized");
  res.status(500).json({ message: "An unexpected error has occurred." });
});
if (process.env.NODE_ENV === "production") {
  server.use(express2.static(Path2.resolve("public")));
  server.use("/assets", express2.static(Path2.resolve("./dist/assets")));
  server.get("*", (req, res) => {
    res.sendFile(Path2.resolve("./dist/index.html"));
  });
}
var server_default = server;

// server/index.ts
var PORT = process.env.PORT || 3e3;
server_default.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
