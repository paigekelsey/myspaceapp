const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./server/db/db");
const Users = require("./server/db/model/Users");
const axios = require("axios");

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                callbackURL: "/api/auth/google/callback",
                passReqToCallback: true,
            },
            async (req, accessToken, refreshToken, profile, done) => {
                const { familyName, givenName } = profile.name;
                const newUser = {
                    googleId: profile.id,
                    username: profile.displayName,
                    firstName: givenName,
                    lastName: familyName,
                    email: `${givenName}${familyName}@gmail.com`,
                    password: "default_",
                    userType: "USER",
                };
                try {
                    let user = await Users.findOne({
                        where: {
                            googleId: profile.id,
                        },
                    });

                    if (!user) {
                        user = await Users.create(newUser);
                    }

                    // Ends the authentication thingy
                    done(null, user);
                } catch (err) {
                    console.error(err);
                }
            },
        ),
    );
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        Users.findByPk(id)
            .then((user) => {
                done(null, user);
            })
            .catch((err) => {
                console.error(err);
            });
    });
};
