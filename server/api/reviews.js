const express = require("express");
const router = express.Router();

// Errors
const { notFound, badSyntax } = require("./errors");

const {
    syncAndSeed,
    model: { Products, Artists, Categories, Users, Orders, Reviews },
} = require("../db");

// All Reviews
router.get("/", async (req, res, next) => {
    try {
        const reviews = await Reviews.findAll({
            include: [Products, Users],
        });

        res.send(reviews);
    } catch (err) {
        next(err);
    }
});

// Single Review
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const review = await Reviews.findOne({
            where: { id },
            include: [Products, Users],
        });

        // If no user, 404
        if (!review) throw notFound("Review not found");

        res.send(review);
    } catch (err) {
        next(err);
    }
});

// Adding a review
router.post("/", async (req, res, next) => {
    try {
        const { detail, rating, productId, userId } = req.body;

        // Error handling for correct syntax
        if (!detail) throw badSyntax("Reviews need a 'detail' property");
        if (!productId || !userId) {
            throw badSyntax("Reviews need a productId and a userId");
        }

        // Find associated product and user
        const product = await Products.findByPk(productId);
        const user = await Users.findByPk(userId);

        // Error handling if product or user don't exist
        if (!product && !user) throw notFound("Product and User not found");
        if (!product) throw notFound("Product not found");
        if (!user) throw notFound("User not found");

        // Make a new review
        const newReview = await Reviews.create({
            detail,
            rating,
            userId,
            productId,
        });

        res.status(201).send(newReview);
    } catch (err) {
        next(err);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        // Reviews can only update detail. Must delete to reassign User or Product
        const { detail } = req.body;

        // Finds Review
        let review = await Reviews.findOne({ where: { id } });

        // If no user, 404
        if (!review) throw notFound("Review not found");

        // If no detail, incorrect syntax
        if (!detail) throw badSyntax("Review detail cannot be empty");

        review.detail = detail;
        await review.save();

        // Save changes
        await user.save();

        // Finds user again with the same format as GET
        const updatedReview = await Reviews.findOne({
            where: { id },
            include: [Products, Users],
        });

        res.status(200).send(updatedReview);
    } catch (err) {
        next(err);
    }
});

// Deletes a review
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const review = await Reviews.findOne({ where: { id } });

        // If id did not correspond to a user, throw error
        if (!review) throw notFound("Review not found");

        await Reviews.destroy({
            where: { id },
        });

        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
