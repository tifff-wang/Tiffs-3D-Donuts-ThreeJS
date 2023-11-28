import { bases } from "../seedData.js";

export async function seed(knex) {
  return await knex("bases").insert(bases);
}
