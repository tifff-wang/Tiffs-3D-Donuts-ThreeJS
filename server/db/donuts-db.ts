import { Base, Donut, DonutDetails, Glaze } from "../../models/donuts";
import db from "./connection";

//Get all flavours
export function getAllGlazes(): Promise<Glaze[]> {
  const glazes = db("glazes").select();
  return glazes;
}

//Get all base types
export function getAllBases(): Promise<Base[]> {
  const bases = db("bases").select();
  return bases;
}

export const getBase = (id): Promise<Base> => {
  return db("bases").select().where({ id }).first();
};

export const getGlaze = (id): Promise<Glaze> => {
  return db("glazes").select().where({ id }).first();
};

export const getDonut = (id): Promise<DonutDetails> => {
  return db("donuts")
    .select()
    .where({ "donuts.id": id })
    .select(
      "donuts.id AS id",
      "donuts.auth0_id",
      "donuts.glaze AS glazeId",
      "donuts.gold",
      "donuts.base AS baseId",
      "glazes.name AS glazeName",
      "glazes.price",
      "glazes.color AS glazeColor",
      "bases.name AS baseName",
      "bases.color AS baseColor",
    )
    .join("glazes", "donuts.glaze", "glazes.id")
    .join("bases", "donuts.base", "bases.id")
    .first();
};

export const getDonuts = (auth0Id): Promise<DonutDetails[]> => {
  return db("donuts")
    .select(
      "donuts.id AS id",
      "donuts.auth0_id",
      "donuts.glaze AS glazeId",
      "donuts.gold",
      "donuts.base AS baseId",
      "glazes.name AS glazeName",
      "glazes.price",
      "glazes.color AS glazeColor",
      "bases.name AS baseName",
      "bases.color AS baseColor",
    )
    .where({ auth0_id: auth0Id })
    .join("glazes", "donuts.glaze", "glazes.id")
    .join("bases", "donuts.base", "bases.id");
};

export const insertDonut = (donut): Promise<Donut[]> => {
  return db("donuts").insert(donut).returning("*");
};

export const deleteDonut = (id): Promise<number> => {
  return db("donuts").delete().where({ id });
};
