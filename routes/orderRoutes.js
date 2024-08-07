const router = require("express").Router();

const {
  getOrdersById,
  getAllOrders,
} = require("../controllers/orderController");

router.get("/getordersbyid/:userId", getOrdersById);
router.get("/getallorders", getAllOrders);
module.exports = router;
