const sequelize = require("../sequelize");
const { DataTypes } = require("sequelize");

const Spacecraft = sequelize.define(
    "Spacecraft", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nume: {
            type: DataTypes.STRING
        },
        viteza: {
            type: DataTypes.INTEGER
        },
        masa: {
            type: DataTypes.INTEGER
        }

    }, { tableName: "Spacecrafts" }
)

module.exports = Spacecraft;