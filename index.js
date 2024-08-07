require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const connection = require("./db");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const checkoutRoutes = require("./routes/checkout");
const adminRoutes = require("./routes/adminRoutes");
const cartRoutes =  require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

connection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port ${port}...`));
