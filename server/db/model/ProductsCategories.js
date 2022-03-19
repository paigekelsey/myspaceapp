const {Sequelize, DataTypes} = require('sequelize');
const db = require('../db');

const ProductsCategories = db.define('productsCategories',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      productId: {
        type: DataTypes.INTEGER,
      },
      categoryId: {
        type: DataTypes.INTEGER,
      },
})

module.exports = ProductsCategories;