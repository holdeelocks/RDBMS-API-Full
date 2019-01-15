exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("cohorts")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("cohorts").insert([
        { id: 1, name: "FSW15" },
        { id: 2, name: "DS01" },
        { id: 3, name: "FSWPT3" },
        { id: 5, name: "Amazon.com" }
      ]);
    });
};
