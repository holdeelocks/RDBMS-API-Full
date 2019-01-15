exports.up = function(knex, Promise) {
  return knex.schema.createTable("students", function(tbl) {
    tbl.increments("Id");
    tbl
      .string("name", 80)
      .notNullable()
      .unique("uq_student_name");
    tbl
      .integer("cohort_id")
      .notNullable()
      .references("id")
      .inTable("cohorts");
    tbl.timestamp("createdAt").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("students");
};
