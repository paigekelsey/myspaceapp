const app = require("./app");

// Database Imports
const {
    syncAndSeed,
    model: { Products, Artists, Categories, Users, Orders, Reviews, Cart },
} = require("./db");

// Error handling middleware
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(err.status || 500);
    res.send(err.message || "Internal server error");
});

const PORT = process.env.PORT || 3000;

const init = async () => {
    await syncAndSeed();
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
};

init();
