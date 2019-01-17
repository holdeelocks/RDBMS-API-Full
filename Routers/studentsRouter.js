const express = require("express");
const knex = require("knex");

const knexConfig = require("../knexfile");
const db = knex(knexConfig.development);

const router = express.Router();

router.get("/:id", (req, res) => {
  const { id } = req.params;

  db("students")
    .join("cohorts", "cohorts.id", "students.cohort_id")
    .select("students.id", "students.name", "cohorts.name as cohort")
    .where({ "students.id": id })
    .first()
    .then(student => res.status(200).json(student))
    .catch(err => res.status(500).json({ error: "Unable to reach server" }));
});

router.get("/", (req, res) => {
  db("students")
    .then(students => res.status(200).json(students))
    .catch(err => res.status(500).json(err));
});

router.post("/", async (req, res) => {
  const { cohort_id, name } = req.body;
  if (!name || !cohort_id) {
    return res.status(400).json({ error: "Please include a name" });
  }
  const cohort = await db("cohorts").where({ id: cohort_id });

  if (cohort.length !== 0) {
    db("students")
      .insert(req.body)
      .then(ids => {
        db("students")
          .where({ id: ids[0] })
          .then(student => {
            if (student) {
              res.status(201).json(student);
            }
          });
      })
      .catch(err => {
        if (err.errno === 19) {
          res.status(400).json({ error: "That student name already exists" });
        } else {
          res.status(500).json(err);
        }
      });
  } else {
    res.status(400).json({ error: "A cohort with that ID does not exist" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  if (changes.cohort_id) {
    const cohort = await db("cohorts").where({ id: changes.cohort_id });
    if (cohort.length !== 0) {
      db("students")
        .where({ id })
        .update(changes)
        .then(count => {
          return count === 0
            ? res.status(404).json({ error: "A student with that id does not exist" })
            : res.status(203).json(count);
        });
    } else {
      res.status(400).json({ error: "A cohort with that id does not exist" });
    }
  } else {
    db("students")
      .where({ id })
      .update(changes)
      .then(count => {
        return count === 0
          ? res.status(404).json({ error: "A student with that id does not exist" })
          : res.status(203).json(count);
      });
  }
});

module.exports = router;
