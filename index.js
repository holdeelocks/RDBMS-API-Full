const express = require("express");
const knex = require("knex");
const helmet = require("helmet");

const knexConfig = require("./knexfile");

const server = express();
const db = knex(knexConfig.development);

server.use(express.json());
server.use(helmet());

//routes

server.post("/api/cohorts", (req, res) => {
  db("cohorts");
});

server.get("/api/cohorts", (req, res) => {
  db("cohorts")
    .then(cohorts => res.status(200).json(students))
    .catch(err => res.status(500).json(err));
});

const port = 3001;
server.listen(port, () => console.log(`Server up and listening on Port: ${port}`));
