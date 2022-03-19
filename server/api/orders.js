const express = require("express");
const router = express.Router();

// Errors
const { notFound, badSyntax } = require("./errors");

const {
  syncAndSeed,
  model: {
    Products,
    Artists,
    Categories,
    Users,
    Orders,
    Reviews,
    ProductsOrders,
  },
} = require("../db");

// All Orders
router.get("/", async (req, res, next) => {
  try {
    const orders = await Orders.findAll({
      include: [
        Users,
        {
          model: Products,
          required: false,
          attributes: ["id", "name", "price"],
          through: {
            model: ProductsOrders,
            attributes: ["quantity"],
          },
        },
      ],
    });

    res.send(orders);
  } catch (err) {
    next(err);
  }
});

//add single product to cart
// router.put("/cart", async (req, res, next) => {
//   try {
//     const currProduct = await Products.findByPk(req.body.productId);
//     const currUser = await req.body.userId;
//     await currProduct.update({ stock: stock - 1 });
//     const [newOrder, OrderWasCreated] = await Orders.findOrCreate({});
//     //make sure to update the current quantity so that multiple users cant buy the same item if it is in someone else's cart
//     res.send(currProduct);
//   } catch (err) {
//     next(err);
//   }
// });

// Single Order
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Orders.findOne({
      where: { id },
      include: [
        Users,
        {
          model: Products,
          required: false,
          attributes: ["id", "name", "price"],
          through: {
            model: ProductsOrders,
            as: "details",
            attributes: ["quantity"],
          },
        },
      ],
    });

    if (!order) throw notFound("Order not found");

    res.send(order);
  } catch (err) {
    next(err);
  }
});

// Create Order
router.post("/", async (req, res, next) => {
  try {
    console.log("server orders route ", req.body);
    // API {
    //     products: [ { id: #, quantity: # }, { id: another #, quantity: # }, ...],
    //     userId: #,
    // }

    const { products, userId } = req.body;

    // Error handling
    if (!products.length) {
      throw badSyntax("Orders must have at least one product");
    }
    if (!userId) throw badSyntax("Orders must have an associated user");

    // Create the order and initialize product orders
    let newOrder = await Orders.create({ userId });
    let productOrders = [];

    let total = 0;

    // Loop through products to create product orders
    for (const { productId, price, quantity } of products) {
      console.log("PRODUCTID:", productId);
      const product = await Products.findByPk(productId);

      // If no product, destroy the order and tell user why it failed
      if (!product) {
        await Orders.destroy({ where: { id: newOrder.id } });
        throw notFound(`Product with id #${productId} not found`);
      }

      // Same with quantity
      if (!quantity) {
        await Orders.destroy({ where: { id: newOrder.id } });
        throw badSyntax(
          `Client did not supply quantity of product #${productId}`
        );
      }

      total += price * quantity;

      // Push this to our product-orders array
      productOrders.push({
        productId: productId,
        orderId: newOrder.id,
        price: price,
        quantity,
      });
    }

    newOrder.total = total;
    newOrder.status = "Processing";
    await newOrder.save();

    // If we've made it this far, we can create the product orders
    await Promise.all(
      productOrders.map((productOrder) => {
        ProductsOrders.create({ ...productOrder });
      })
    );

    products.map((product) => {
      Products.decrement("stock", {
        by: product.quantity,
        where: { id: product.productId },
      });
    });

    const newPostedOrder = await Orders.findOne({
      where: { id: newOrder.id },
      include: [
        Users,
        {
          model: Products,
          required: false,
          attributes: ["id", "name", "price"],
          through: {
            model: ProductsOrders,
            as: "details",
            attributes: ["quantity"],
          },
        },
      ],
    });

    // Send the new order
    res.status(201).send(newPostedOrder);
  } catch (err) {
    next(err);
  }
});

// INCOMPLETE RIGHT NOW
router.put("/:id", async (req, res, next) => {
  try {
    // We are not ready for the put route, so sending a 503 Service Unavailable response now
    res.sendStatus(503);
  } catch (err) {
    next(err);
  }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  const order = await Orders.findByPk(id);

  // If id did not correspond to a order, throw error
  if (!order) throw notFound("Order not found");

  // Find and remove all associations
  const products = await order.getProducts();
  order.removeProducts(products);

  // Delete order
  await Orders.destroy({ where: { id } });

  res.sendStatus(200);
});

module.exports = router;
