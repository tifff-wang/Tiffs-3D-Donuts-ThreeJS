export function up(knex) {
  return knex.schema.createTable("bases", (table) => {
    table.increments("id").primary();
    table.string("color");
    table.string("name");
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists("bases");
}
