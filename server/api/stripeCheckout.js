const cors = require("cors");
const express = require("express");
const open = require("open");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51ImoMPDR0fOunmqdng791kpEeP4y8orA2Hx71h1TxJKwvWtpOrSrCZdEpDLhTFO67N767ve8HUSye4lPDZP9mihx00VfEWPiK3"
);
//const uuid = require("uuid/v4");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
router.use(cors());

// app.get("/", (req, res) => {
//   res.send("Add your Stripe Secret Key to the .require('stripe') statement!");
// });

async function main(data) {
  const { token, total, cart } = data;
  // console.log('data object',data)
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
  const test = "testing 123";
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: token.email, // list of receivers
    subject: "Order Received", // Subject line
    text: "Thank you for your Order", // plain text body
    html: `<b><div><h1>Thank you for your order</h1><h3>Here is a summary of your order</h3></div><ul>${cart
      .map((curr) => {
        return `<li>Product Name: ${curr.name} Product Price: ${curr.price} Quantity Purchased: ${curr.quantity}</li>`;
      })
      .join(
        ""
      )}</ul><h3>Your Order Total is: $${total}</h3> <h3>Thanks for your business!</h3></b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  open(nodemailer.getTestMessageUrl(info));
}

router.post("/", async (req, res) => {
  console.log("TOKENTOSEND", req.body);
  console.log("CART", req.body.tokenToSend.cart);
  let error;
  let status;
  try {
    const { token } = req.body.tokenToSend;

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const idempotencykey = uuidv4();
    //console.log("key", idempotencykey);
    const charge = await stripe.charges.create(
      {
        amount: req.body.tokenToSend.total,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased`,
        // shipping: {
        //   name: token.card.name,
        //   address: {
        //     line1: token.card.address_line1,
        //     line2: token.card.address_line2,
        //     city: token.card.address_city,
        //     country: token.card.address_country,
        //     postal_code: token.card.address_zip,
        //   },
        // },
      }
      // {
      //   idempotencykey,
      // }
    );
    console.log("CHARGE", charge);
    status = "success";
    main(req.body.tokenToSend).catch(console.error);
  } catch (error) {
    status = "failure";
  }

  res.json({ error, status });
});

module.exports = router;
