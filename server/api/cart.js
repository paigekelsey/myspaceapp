const express = require("express");
const router = express.Router();

// Errors
const { notFound, badSyntax, conflict } = require("./errors");

const {
  syncAndSeed,
  db,
  model: { Products, Artists, Categories, Users, Orders, Reviews, Cart },
} = require("../db");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// All Users
router.post("/", async (req, res, next) => {
  try {
    const doesProductExist = await Cart.findAll({
      where: {
        productId: req.body.product.id,
      },
    });
    if (doesProductExist.length > 0) {
      // const toUpdate = await Cart.findAll();
      await Cart.increment("quantity", {
        where: { productId: req.body.product.id },
      });
    } else {
      const cart = await Cart.create({
        userId: req.body.userId,
        productId: req.body.product.id,
        name: req.body.product.name,
        price: req.body.product.price,
      });
    }
    const updatedCart = await Cart.findAll();
    res.send(updatedCart);
  } catch (err) {
    next(err);
  }
});

router.get("/productsInCart/:id", async (req, res, next) => {
  try {
    const cart = await Cart.findAll({
      where: {
        userId: req.params.id,
      },
    });
    res.send(cart);
  } catch (err) {
    next(err);
  }
});

router.delete("/productsInCart/:id", async (req, res, next) => {
  try {
    const updatedCart = await Cart.destroy({
      where: { productId: req.params.id },
    });
    const cart = await Cart.findAll({
      where: {
        userId: req.body.userId,
      },
    });
    console.log("server cart", cart);
    res.send(cart);
  } catch (err) {
    next(err);
  }
});

router.put("/productsInCart/increase/:id", async (req, res, next) => {
  try {
    console.log("userId", req.body.data.userId);
    await Cart.increment("quantity", {
      where: { productId: req.params.id },
    });
    const cart = await Cart.findAll({
      where: {
        userId: req.body.data.userId,
      },
    });
    res.send(cart);
  } catch (err) {
    next(err);
  }
});

router.put("/productsInCart/decrease/:id", async (req, res, next) => {
  try {
    console.log("userId", req.body.data.userId);
    await Cart.decrement("quantity", {
      where: { productId: req.params.id },
    });
    const cart = await Cart.findAll({
      where: {
        userId: req.body.data.userId,
      },
    });
    res.send(cart);
  } catch (err) {
    next(err);
  }
});

router.delete("/emptyCart", async (req, res, next) => {
  try {
    await Cart.destroy({
      where: {},
      truncate: true,
    });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
