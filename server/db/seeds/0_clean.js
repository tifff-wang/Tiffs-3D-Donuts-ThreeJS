export async function seed(knex) {
  await knex("donuts").del();
  await knex("glazes").del();
  await knex("bases").del();
}
