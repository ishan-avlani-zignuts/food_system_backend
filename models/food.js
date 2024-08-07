
    const mongoose = require("mongoose");

    const foodSchema = new mongoose.Schema(
      {
        dish: {
          type: String,
          required: true,
        },
        imgdata: {
          type: String,
          required: true,
        },
        desc: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
      },
      {
        timestamps: true,
      }
    );

    const Food = mongoose.model("Food", foodSchema);

    module.exports = { Food };
