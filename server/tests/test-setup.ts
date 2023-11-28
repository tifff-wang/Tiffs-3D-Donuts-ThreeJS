import { afterAll, beforeAll, beforeEach } from "vitest";
import db from "../db/connection";

beforeAll(() => {
  return db.migrate.latest();
});

// reseeds before each
beforeEach(() => {
  return db.seed.run();
});

afterAll(() => {
  db.destroy();
});
