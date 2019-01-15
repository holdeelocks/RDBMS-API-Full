exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("students")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("students").insert([
        { Id: 1, name: "Holden Bucher", cohort_id: 1 },
        { Id: 2, name: "Jeff Henriod", cohort_id: 5 },
        { Id: 3, name: "Jeff Bezos", cohort_id: 2 }
      ]);
    });
};
