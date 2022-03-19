const { Sequelize, DataTypes } = require("sequelize");

// Database Imports
const db = require("../db");
const Users = require("./Users");

const Orders = db.define("orders", {
    total: {
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "Created",
        allowNull: false,
        validate: {
            isIn: [
                ["Created", "Processing", "Cancelled", "Shipped", "Completed"],
            ],
        },
    },
});

module.exports = Orders;
