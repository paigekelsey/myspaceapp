const Products = require("./Products");
const Artists = require("./Artists");
const Categories = require("./Categories");
const Users = require("./Users");
const Orders = require("./Orders");
const Reviews = require("./Reviews");
const ProductsOrders = require("./ProductsOrders");
const Cart = require("./Cart");
const ProductsCategories = require("./ProductsCategories");

// ------ Associations ------
Users.hasMany(Orders);
Orders.belongsTo(Users);

Users.hasMany(Reviews);
Reviews.belongsTo(Users);

Artists.hasMany(Products);
Products.belongsTo(Artists);

Products.belongsToMany(Orders, {
    through: ProductsOrders,
    foreignKey: "productId",
    otherKey: "orderId",
});
Orders.belongsToMany(Products, {
    through: ProductsOrders,
    foreignKey: "orderId",
    otherKey: "productId",
});

Products.hasMany(Reviews);
Reviews.belongsTo(Products);

Products.belongsToMany(Categories, {
    through: ProductsCategories,
    foreignKey: "productId",
    otherKey: "categoryId",
});
Categories.belongsToMany(Products, {
    through: ProductsCategories,
    foreignKey: "categoryId",
    otherKey: "productId",
});
// --------------------------

module.exports = {
    model: {
        Products,
        Artists,
        Categories,
        Users,
        Orders,
        Reviews,
        ProductsOrders,
        ProductsCategories,
        Cart,
    },
};
