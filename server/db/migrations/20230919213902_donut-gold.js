export function up(knex) {
  return knex.schema.alterTable("donuts", (table) => {
    table.boolean("gold");
  });
}

export function down(knex) {
  return knex.schema.alterTable("donuts", (table) => {
    table.dropColumn("gold");
  });
}
