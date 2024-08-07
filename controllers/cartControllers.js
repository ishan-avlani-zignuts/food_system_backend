const asyncHandler = require("express-async-handler");
const { Cart } = require("../models/cart");

const addToCart = asyncHandler(async (req, res) => {
  const { userId, foodId } = req.body;
  console.log("Request body:", req.body);

  try {
    let cart = await Cart.findOne({ userId });
    console.log("Cart found:", cart);

    if (cart) {
      const foodIds = cart.items.map((item) => item.foodId.toString());
      console.log("Food IDs in cart:", foodIds);

      if (foodIds.includes(foodId.toString())) {

        const itemIndex = cart.items.findIndex(
          (item) => item.foodId.toString() === foodId.toString()
        );
        cart.items[itemIndex].quantity += 1;
      } else {

        cart.items.push({ foodId, quantity: 1 });
      }

      console.log("Cart before save:", cart);
      cart = await cart.save();
      console.log("Cart after save:", cart);

      return res.status(201).send(cart);
    } else {
      const newCart = await Cart.create({
        userId,
        items: [{ foodId, quantity: 1 }],
      });

      console.log("New cart created:", newCart);
      return res.status(201).send(newCart);
    }
  } catch (error) {
    console.error("Error during adding to cart:", error);
    res.status(500).send({ message: "Internal server error", error: error });
  }
});

const updateCartQuantity = asyncHandler(async (req, res) => {
  const { userId, foodId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.foodId.toString() === foodId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        return res.status(200).send(cart);
      } else {
        return res.status(404).send({ message: "Item not found in cart" });
      }
    } else {
      return res.status(404).send({ message: "Cart not found for user" });
    }
  } catch (error) {
    console.error("Error during updating cart quantity:", error);
    res.status(500).send({ message: "Internal server error", error: error });
  }
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { userId, foodId } = req.body;
  
  try {
    const cart = await Cart.findOne({ userId });

    if (cart) {
      cart.items = cart.items.filter((item) => item.foodId != foodId);
      await cart.save();
      return res.status(201).send(cart);
    } else {
      return res.status(404).send({ message: "Cart not found for user" });
    }
  } catch (error) {
    console.error("Error during removing from cart:", error);
    res.status(500).send({ message: "Internal server error", error: error });
  }
});

const getCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.foodId");

    if (cart) {
      return res.status(200).send(cart);
    } else {
      return res.status(404).send({ message: "Cart not found for user" });
    }
  } catch (error) {
    console.error("Error during fetching cart:", error);
    res.status(500).send({ message: "Internal server error", error: error });
  }
});

module.exports = {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  getCart,
};
