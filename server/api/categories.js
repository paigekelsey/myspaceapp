const express = require("express");
const router = express.Router();

// Error Imports
const { notFound, badSyntax, conflict, unauthorized } = require("./errors");

// DB Imports
const {
    syncAndSeed,
    db,
    model: { Products, Artists, Categories, Users, Orders, Reviews },
} = require("../db");

// All Categories
router.get("/", async (req, res, next) => {
    try {
        const categories = await Categories.findAll({ include: [Products] });
        res.send(categories);
    } catch (err) {
        next(err);
    }
});

// Single Category
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await Categories.findOne({ where: id });

        // If no user, 404
        if (!category) throw notFound("Category not found");

        res.send(category);
    } catch (err) {
        next(err);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const { name } = req.body;
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

        // Error handling
        if (!name) throw badSyntax("Category needs a name property");

        // Create new category
        const newCategory = await Categories.create({ name });
        res.status(201).send(newCategory);
    } catch (err) {
        const { errors } = err;
        if (errors) {
            // For each error
            errors.forEach((error) => {
                // Customize error message and status
                switch (error.type) {
                    case "unique violation":
                        next(conflict(error.message));
                }
            });
        }

        next(err);
    }
});

router.put("/:id", async (req, res, next) => {
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

        // Category info update
        const { name } = req.body;

        // Finds Category
        let category = await Categories.findOne({ where: { id } });

        // If no category, 404
        if (!category) throw notFound("Category not found");

        if (name) category.name = name;

        // Save changes
        await category.save();

        // Finds user again with the same format as GET
        const updatedCategory = await Categories.findByPk(id);

        res.status(200).send(updatedCategory);
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

        const category = await Categories.findOne({ where: { id } });

        // If id did not correspond to a category, throw error
        if (!category) throw notFound("Category not found");

        await Categories.destroy({
            where: { id },
        });

        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
