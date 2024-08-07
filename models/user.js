const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },

  lastname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  pic: {
    type: String,
    required: true,
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  role: { type: String, enum: ["user", "admin"] },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const complexityOptions = {
  min: 8,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
};

const passwordComplexityValidator = passwordComplexity(complexityOptions);

const validate = (data) => {
  const schema = joi.object({
    firstname: joi.string().required().label("firstname"),
    lastname: joi.string().required().label("lastname"),
    email: joi.string().email().required().label("email"),
    password: passwordComplexityValidator.required().label("password"),
    pic: joi.string().optional().label("profile picture"),
    role: joi.string().valid("user", "admin").label("Role"),
  });
  return schema.validate(data);
};

const User = mongoose.model("user", userSchema);

module.exports = { User, validate };
