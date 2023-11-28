export function up(knex) {
  return knex.schema.createTable("donuts", (table) => {
    table.increments("id").primary();
    table.integer("base").references("bases.id");
    table.integer("glaze");
    table.string("auth0_id");
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists("donuts");
}
