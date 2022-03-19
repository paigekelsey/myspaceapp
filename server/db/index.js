const db = require("./db");
const {
    model: {
        Products,
        Artists,
        Categories,
        Users,
        Orders,
        Reviews,
        Cart,
        ProductsOrders,
        ProductsCategories,
    },
} = require("./model");
const { syncAndSeed } = require("./seed");

module.exports = {
    syncAndSeed,
    db,
    model: {
        Products,
        Artists,
        Categories,
        Users,
        Orders,
        Reviews,
        Cart,
        ProductsOrders,
        ProductsCategories,
    },
};
