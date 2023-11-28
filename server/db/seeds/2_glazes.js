import { glazes } from "../seedData.js";

export async function seed(knex) {
  return await knex("glazes").insert(glazes);
}
