const express = require("express");
const router = express.Router();

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

const { notFound, unauthorized, conflict, badSyntax } = require("./errors");

// All Admins
router.get("/", async (req, res, next) => {
    try {
        const admins = await Users.findAll({
            where: { userType: "ADMIN" },
        });
        res.send(admins);
    } catch (err) {
        next(err);
    }
});

// Single Admin
router.get("/:id", async (req, res, next) => {
    try {
        const admin = await Users.findOne({
            where: { id: req.params.id, userType: "ADMIN" },
        });
        res.send(admin);
    } catch (err) {
        next(err);
    }
});

// For admin use only, lets you dictate the userType
router.post("/users", async (req, res, next) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization;

        // Need to send a token to use this route
        if (!token) throw unauthorized("Invalid credentials");

        // User info update
        const { firstName, lastName, pronouns, username, email, userType } = req.body;

        const props = [firstName, lastName, pronouns, username, email, userType];

        // Error handling for correct request body syntax
        for (let prop of props) {
            if (!prop)
                throw badSyntax(
                    "New Users must have all of the following properties: First Name, Last Name, username, Email, userType",
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

        const newUser = await Users.create({
            pronouns,
            email,
            username,
            password: "default_",
            userType,
        });

        // Finds user again with the same format as GET
        const postedUser = await Users.findOneIncludes(newUser.id);

        res.status(201).send(postedUser);
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

// For admin use only, lets you edit the userType
router.put("/users/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization;

        // Need to send a token to use this route
        if (!token) throw unauthorized("Invalid credentials");

        // User info update
        const { pronouns, username, email, userType } = req.body;

        // Finds user who made request
        const requestor = await Users.findByToken(token);

        // If no requestor, 401
        if (!requestor) throw unauthorized("Invalid credentials");

        // If user is not an admin, 401 error
        if (requestor.userType !== "ADMIN") {
            throw unauthorized("Invalid credentials");
        }

        // Finds user to be edited
        let user = await Users.findOne({ where: { id } });

        // If user doesn't exist,
        if (!user) throw notFound("User not found");

        if(pronouns) user.pronouns = pronouns;
        if (username) user.username = username;
        if (email) user.email = email;
        if (userType) user.userType = userType;

        // Save changes
        await user.save();

        // Finds user again with the same format as GET
        const updatedUser = await Users.findOneIncludes(id);

        res.status(200).send(updatedUser);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
