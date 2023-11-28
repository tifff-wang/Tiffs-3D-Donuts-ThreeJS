import { donuts } from "../seedData.js";

export async function seed(knex) {
  return await knex("donuts").insert(donuts);
}
