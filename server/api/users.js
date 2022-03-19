const express = require("express");
const router = express.Router();

// Errors
const { notFound, badSyntax, conflict, unauthorized } = require("./errors");

const {
    syncAndSeed,
    db,
    model: { Products, Artists, Categories, Users, Orders, Reviews },
} = require("../db");

// All Users
router.get("/", async (req, res, next) => {
    try {
        const users = await Users.findAllIncludes();
        res.send(users);
    } catch (err) {
        next(err);
    }
});

// Single User
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await Users.findOneIncludes(id);

        // If no user, 404
        if (!user) throw notFound("User not found");

        res.send(user);
    } catch (err) {
        next(err);
    }
});

// This route is for anybody signing up to create their own user
router.post("/", async (req, res, next) => {
    try {
        const { email, username, pronouns, password } = req.body;

        if (!email) throw badSyntax("User needs an email property");
        if (!username) throw badSyntax("User needs a username property");
        if (!pronouns) throw badSyntax("User needs a pronouns property");
        if (!password) throw badSyntax("User needs a password property");

        const newUser = await Users.create({
    
            pronouns,
            email,
            username,
            password,
            userType: "USER",
        });

        res.status(201).send(newUser);
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

// Allows users to edit their own profiles
router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        // Need token to prove you have the authentication to edit yourself
        const token = req.headers.authorization;
        if (!token) throw unauthorized("Invalid credentials");

        // Finds user who made request
        const requestor = await Users.findByToken(token);
        if (!requestor) throw unauthorized("Invalid credentials");

        // Prevents anybody from accessing this route and editing people
        if (requestor.id !== parseInt(id)) {
            throw unauthorized("Invalid credentials");
        }

        // User info update
        const { firstName, lastName,pronouns, username, email } = req.body;

        // Finds user
        let user = await Users.findOne({ where: { id } });

        // If no user, 404
        if (!user) throw notFound("User not found");

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if(pronouns) user.pronouns = pronouns;
        if (username) user.username = username;
        if (email) user.email = email;

        // Save changes
        await user.save();

        // Finds user again with the same format as GET
        const updatedUser = await Users.findOneIncludes(id);

        res.status(200).send(updatedUser);
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

        const user = await Users.findOne({ where: { id } });

        // If id did not correspond to a user, throw error
        if (!user) throw notFound("User not found");

        await Users.destroy({
            where: { id },
        });

        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
