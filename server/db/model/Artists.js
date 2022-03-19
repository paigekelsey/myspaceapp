const { Sequelize, DataTypes } = require("sequelize");
const db = require("../db");

const Artists = db.define("artists", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
});

module.exports = Artists;
