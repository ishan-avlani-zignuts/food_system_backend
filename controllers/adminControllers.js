const asyncHandler = require("express-async-handler");
const { Food } = require("../models/food");

const addFood = asyncHandler(async (req, res) => {
  const { dish, desc, price, rating } = req.body;
  const imgdata = req.file ? req.file.path : "";

  if (!dish || !desc || !price || !rating || !imgdata) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  try {
    const newFood = new Food({
      dish,
      desc,
      price,
      rating,
      imgdata,
    });
    await newFood.save();
    res.status(201).send({ message: "Food added successfully" });
  } catch (error) {
    console.error("Error during creating food:", error);
    res.status(500).send({ message: "Internal server error", error: error });
  }
});

const editFood = asyncHandler(async (req, res) => {
  const { id } = req.params; 

  if (!id) {
    res.status(400);
    throw new Error("ID is required");
  }

  try {
    const updatedFood = await Food.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, 
    });

    if (!updatedFood) {
      return res.status(404).send({ message: "Food not found" });
    }

    res.status(200).send({
      message: "Food updated successfully",
      food: updatedFood,
    });
  } catch (error) {
    console.error("Error updating food:", error);
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
});

const deleteFood = asyncHandler(async (req, res) => {
  const { id } = req.params; 

  if (!id) {
    res.status(400);
    throw new Error("ID is required");
  }

  try {
    const deletedFood = await Food.findByIdAndDelete(id);
    if (!deletedFood) {
      return res.status(404).send({ message: "Food not found" });
    }
    res.status(200).send({ message: "Food deleted successfully" });
  } catch (error) {
    console.error("Error deleting food:", error);
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
});

const getFood = asyncHandler(async (req, res) => {
  try {
    const foods = await Food.find();
    return res.json(foods);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch foods" });
  }
});

module.exports = { addFood, editFood, deleteFood, getFood };
