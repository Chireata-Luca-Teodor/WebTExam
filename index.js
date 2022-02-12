"use strict";
const express = require("express");
const sequelize = require("./sequelize");
const cors = require("cors");
const port = 7000;

const Spacecraft = require("./models/spacecraft");
const Astronaut = require("./models/astronaut");

const app = express();
app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());
app.use(cors());

Spacecraft.hasMany(Astronaut);

app.use("/api", require("./routes/spacecrafts"));
app.use("/api", require("./routes/astronauts"));

app.listen(port, async() => {
    console.log(`Server started on http://localhost:${port}`);
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully!");
    } catch (err) {
        console.error("Unable to connect to the database: ", err);
    }
});