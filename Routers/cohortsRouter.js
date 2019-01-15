const express = require("express");
const router = express.Router();
const knex = require("knex");

const knexConfig = require("../knexfile");
const db = knex(knexConfig.development);

router.get("/:id/students", (req, res) => {
  const { id } = req.params;

  db("students")
    .whereRaw("cohort_id = ?", [id])
    .then(resp => {
      if (resp.length !== 0) {
        res.status(200).json(resp);
      } else {
        db("cohorts")
          .where({ id })
          .then(cohort => {
            if (cohort.length !== 0) {
              res.status(400).json({ error: "There are no students in this cohort" });
            } else {
              res.status(404).json({ error: "A cohort with that ID does not exist" });
            }
          });
      }
    })
    .catch(err => res.status(500).json(err));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db("cohorts")
    .where({ id })
    .then(cohort => {
      if (cohort.length === 0) {
        res.status(404).json({ error: "A cohort with that ID does not exist" });
      } else {
        res.status(200).json(cohort);
      }
    })
    .catch(err => res.status(500).json({ error: "Unable to connect to server" }));
});

router.get("/", (req, res) => {
  db("cohorts")
    .then(cohorts => res.status(200).json(cohorts))
    .catch(err => res.status(500).json(err));
});

router.post("/", (req, res) => {
  const changes = req.body;

  db("cohorts")
    .insert(changes)
    .then(response => {
      res.status(201).json(response);
    })
    .catch(err => {
      if (err.errno === 19) {
        res.status(403).json({ error: "A cohort with that name already exists" });
      } else {
        res.status(500).json(err);
      }
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db("cohorts")
    .where({ id })
    .update(changes)
    .then(count => {
      if (count) {
        res.status(203).json(count);
      } else {
        res.status(404).json({ error: "That cohort ID does not exist" });
      }
    })
    .catch(err => {
      if (err.errno === 19) {
        res.status(403).json({ error: "A cohort with that name already exists" });
      } else {
        res.status(500).json(err);
      }
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db("cohorts")
    .where({ id })
    .del()
    .then(count => {
      if (count) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ error: "A cohort with that ID does not exist" });
      }
    })
    .catch(err => res.status(500).json(err));
});

module.exports = router;
