const { Sequelize, DataTypes } = require("sequelize");
const db = require("../db");

const Products = db.define("product", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    artistName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    nationality: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    year: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
        validate: {
            notEmpty: true,
        },
    },
    imgUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "#",
        validate: {
            notEmpty: true,
        },
    },
});

module.exports = Products;
