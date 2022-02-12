const sequelize = require("../sequelize");
const { DataTypes } = require("sequelize");

const Astronaut = sequelize.define(
    "Astronaut", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nume: {
            type: DataTypes.STRING
        },
        rol: {
            type: DataTypes.STRING
        }
    }, { tableName: "Astronauts" }
)

module.exports = Astronaut;