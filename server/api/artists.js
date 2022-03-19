const express = require("express");
const router = express.Router();

// Errors
const { notFound, badSyntax, conflict, unauthorized } = require("./errors");

const {
    syncAndSeed,
    db,
    model: { Products, Artists, Categories, Users, Orders, Reviews },
} = require("../db");

// All Artists
router.get("/", async (req, res, next) => {
    try {
        const artists = await Artists.findAll({ include: [Products] });
        res.send(artists);
    } catch (err) {
        next(err);
    }
});

// Single Artist
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const artist = await Artists.findOne({ where: id });

        // If no user, 404
        if (!artist) throw notFound("Artist not found");

        res.send(artist);
    } catch (err) {
        next(err);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        // Need to send a token to use this route
        if (!token) throw unauthorized("Invalid credentials");

        // If no requestor, 401
        const requestor = await Users.findByToken(token);
        if (!requestor) throw unauthorized("Invalid credentials");

        // If user is not an admin, 401 error
        if (requestor.userType !== "ADMIN") {
            throw unauthorized("Invalid credentials");
        }

        const { id, name } = req.body;

        // Error handling
        if (!name) throw badSyntax("Artist needs a name property");

        // Finds user to be edited
        let artist = await Artists.findOne({ where: { id } });

        // If artist doesn't exist, error
        if (!artist) throw notFound("Artist not found");

        if (name) artist.name = name;

        // Create new artist
        const newArtist = await Artists.create({ name });
        res.status(201).send(newArtist);
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

router.put("/artists/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization;

        // Need to send a token to use this route
        if (!token) throw unauthorized("Invalid credentials");

        // Product info update
        const { name } = req.body;

        // Finds user who made request
        const requestor = await Users.findByToken(token);

        // If no requestor, 401
        if (!requestor) throw unauthorized("Invalid credentials");

        // If user is not an admin, 401 error
        if (requestor.userType !== "ADMIN") {
            throw unauthorized("Invalid credentials");
        }

        // Finds user to be edited
        let artist = await Artists.findOne({ where: { id } });

        // If user doesn't exist,
        if (!artist) throw notFound("Product not found");

        if (name) artist.name = name;

        // Save changes
        await artist.save();

        // Finds user again with the same format as GET
        const updatedArtist = await Artists.findOne({
            where: { id },
            include: [Products],
        });

        res.status(200).send(updatedArtist);
    } catch (err) {
        next(err);
    }
});

router.delete("/artists/:id", async (req, res, next) => {
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

        // Finds user to be edited
        let artist = await Artists.findOne({ where: { id } });

        // If user doesn't exist,
        if (!artist) throw notFound("Product not found");

        Artists.destroy({ where: id });

        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
