const express = require("express");
// const knex = require("knex");
const helmet = require("helmet");

const knexConfig = require("./knexfile");
const cohortsRouter = require("./Routers/cohortsRouter");
const studentsRouter = require("./Routers/studentsRouter");

const server = express();
// const db = knex(knexConfig.development);

server.use(express.json());
server.use(helmet());
server.use("/api/cohorts", cohortsRouter);
server.use("/api/students", studentsRouter);

// cohorts routes

const port = 3001;
server.listen(port, () => console.log(`Server up and listening on Port: ${port}`));
