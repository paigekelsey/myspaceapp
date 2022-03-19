const express = require("express");
const router = express.Router();

// Errors
const { notFound, badSyntax, unauthorized } = require("./errors");

const {
    syncAndSeed,
    model: {
        Products,
        Artists,
        Categories,
        Users,
        Orders,
        Reviews,
        ProductsCategories,
    },
} = require("../db");

// All Products
router.get("/", async (req, res, next) => {
    try {
        const products = await Products.findAll({
            include: [Artists, Categories, Reviews],
            order: [["name"]],
        });
        res.send(products);
    } catch (err) {
        next(err);
    }
});

// Product By Category
router.get("/category/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const productsByCategory = await Products.findAll({
            where: { categoryId: id },
            include: [Artists, Categories, Reviews],
        });
        res.send(productsByCategory);
    } catch (err) {
        next(err);
    }
});

// Single Product
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Products.findOne({
            where: { id },
            include: [Artists, Categories, Reviews],
        });

        if (!product) throw notFound("Product not found");

        res.send(product);
    } catch (err) {
        next(err);
    }
});

// Create Product
router.post("/", async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        // Need to send a token to use this route
        if (!token) throw unauthorized("Invalid credentials");

        // Product info update
        const {
            name,
            description,
            price,
            year,
            stock,
            imgUrl,
            categories,
            artistName,
            nationality,
        } = req.body;

        console.log(req.body);

        const props = [
            name,
            artistName,
            nationality,
            description,
            price,
            year,
            stock,
        ];

        // Error handling for correct request body syntax
        for (let prop of props) {
            if (!prop)
                throw badSyntax(
                    "New products must have all of the following properties: Name, Description, Price, Year, ArtistName, Nationality, and Stock",
                );
        }

        // Finds user who made request
        const requestor = await Users.findByToken(token);

        // If no requestor, 401
        if (!requestor) throw unauthorized("Invalid credentials");

        // If user is not an admin, 401 error
        if (requestor.userType !== "ADMIN") {
            throw unauthorized("Invalid credentials");
        }

        const newProduct = await Products.create({
            name,
            artistName,
            nationality,
            description,
            price,
            year,
            stock,
            imgUrl,
        });

        await newProduct.addCategories(categories.map((cat) => cat.id));
        await newProduct.save();

        // Finds user again with the same format as GET
        const postedProduct = await Products.findOne({
            where: { id: newProduct.id },
            include: [Artists, Categories, Reviews],
        });

        res.status(201).send(postedProduct);
    } catch (err) {
        next(err);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization;

        // Need to send a token to use this route
        if (!token) throw unauthorized("Invalid credentials");

        // Product info update
        const {
            name,
            description,
            price,
            year,
            stock,
            imgUrl,
            categories,
            artistName,
            nationality,
        } = req.body;

        // Finds user who made request
        const requestor = await Users.findByToken(token);

        // If no requestor, 401
        if (!requestor) throw unauthorized("Invalid credentials");

        // If user is not an admin, 401 error
        if (requestor.userType !== "ADMIN") {
            throw unauthorized("Invalid credentials");
        }

        // Finds user to be edited
        let product = await Products.findOne({ where: { id } });

        // If user doesn't exist,
        if (!product) throw notFound("Product not found");

        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (year) product.year = year;
        if (stock) product.stock = stock;
        if (imgUrl) product.imgUrl = imgUrl;
        if (artistName) product.artistName = artistName;
        if (nationality) product.nationality = nationality;

        // Destroy all category associations, we will rebuild
        await ProductsCategories.destroy({
            where: { productId: product.id },
        });

        await product.addCategories(categories.map((cat) => cat.id));

        // Save changes
        await product.save();

        // Finds user again with the same format as GET
        const updatedProduct = await Products.findOne({
            where: { id },
            include: [Artists, Categories, Reviews],
        });

        res.status(200).send(updatedProduct);
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization;

        // Need to send a token to use this route
        if (!token) throw unauthorized("Invalid credentials");

        // Finds user who made request
        const requestor = await Users.findByToken(token);

        // If no requestor, 401
        if (!requestor) throw unauthorized("Invalid credentials");

        // If user is not an admin, 401 error
        if (requestor.userType !== "ADMIN") {
            throw unauthorized("Invalid credentials");
        }

        const product = await Products.findOne({ where: { id } });

        // If id did not correspond to a product, throw error
        if (!product) throw notFound("Product not found");

        await Products.destroy({
            where: { id },
        });

        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
