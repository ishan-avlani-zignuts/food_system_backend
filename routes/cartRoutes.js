const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { addToCart, updateCartQuantity, removeFromCart, getCart } = require("../controllers/cartControllers");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("imgdata");

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

router.post("/addtocart", addToCart);
router.post("/updatecart", updateCartQuantity);
router.post("/removefromcart", removeFromCart);
router.get("/getcart/:userId", getCart);

module.exports = router;
