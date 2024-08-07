const router = require("express").Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.SECRET_KEY);
const Order = require("../models/order");

router.post("/", async (req, res) => {
  try {
    const { userId, products } = req.body;

    console.log("products", products);

    const foodIds = products.map((product) => product.foodId);

    const line_items = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.dish,
          images: [product.imgdata],
        },
        unit_amount: product.price * 100,
      },
      quantity: product.qnty,
    }));

    console.log("line items", line_items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "gpay"],
      line_items,
      mode: "payment",
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:3000/cancel",
      metadata: {
        userId,
        foodIds: JSON.stringify(foodIds),
      },
    });

    res.json({ id: session.id });

    console.log("session data ", session);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/success", async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).send("Session ID is required");
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items.data.price.product"],
    });

    console.log("Retrieved session:", session);
    console.log("Line items data:", session.line_items.data);

    if (session) {
      const foodIds = JSON.parse(session.metadata.foodIds);
      console.log("foodIds in session", foodIds);

      const orderItems = session.line_items.data.map((item, index) => ({
        dish: item.description,
        imgdata: "",
        price: item.price.unit_amount / 100,
        quantity: item.quantity,
        foodId: foodIds[index],
      }));

      const order = new Order({
        userId: session.metadata.userId,
        items: orderItems,
        totalAmount: session.amount_total / 100,
        paymentStatus: session.payment_status,
        sessionId: session.id,
        paymentIntentId: session.payment_intent,
      });

      console.log("order in backend ", order);

      await order.save();

      console.log("order saved", order);
      res.json({ order });
    } else {
      res.status(400).send("Invalid session ID");
    }
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
