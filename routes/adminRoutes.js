const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const {
  addFood,
  editFood,
  deleteFood,
  getFood,
} = require("../controllers/adminControllers");

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

router.post("/addfood", upload, addFood);
router.put("/editfood/:id", editFood);
router.delete("/deletefood/:id", deleteFood);
router.get("/getfood", getFood);

module.exports = router;
