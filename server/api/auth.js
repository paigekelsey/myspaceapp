const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
    syncAndSeed,
    model: { Products, Artists, Categories, Users, Orders, Reviews },
} = require("../db");

router.post("/", async (req, res, next) => {
    const { username, password } = req.body;
    await Users.authenticate({ username, password })
        .then((token) => {
            res.status(201).send({ token });
        })
        .catch((err) => {
            next(err);
        });
});

router.get("/", async (req, res, next) => {
    await Users.findByToken(req.headers.authorization)
        .then((user) => {
            res.send(user);
        })
        .catch((err) => {
            next(err);
        });
});

//Google Auth
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// Google Auth Callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/#/sign-up" }),
    async (req, res) => {
        res.oAuthUser = req.user;
        const token = jwt.sign({ id: req.user.id }, process.env.JWT);

        // Successful authentication, redirect to store.
        res.send(`
        <html>
            <head>
                <script>
                    window.localStorage.setItem('token', '${token}');
                    window.document.location = "/#/store"
                </script>
            </head>
        </html>
        `);
    },
);

module.exports = router;
