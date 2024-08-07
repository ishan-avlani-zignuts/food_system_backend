const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
router.post("/", async (req, res) => {
  console.log("Received signup request with data:", req.body);

try {
  const { firstname, lastname, email, password,role } = req.body;

  const existUser = await User.findOne({ email });
  if (existUser) {
    return res
      .status(401)
      .json({ success: false, message: "User already Exist" });
  }
  const hasepassword = await bcrypt.hashSync(password, 10);
  const newUser = new User({
    firstname,
    lastname,
    email,
    password: hasepassword,
    role: role,
  });

  await newUser.save();

  res.status(200).json({ message: "user register successfully", newUser });
} catch (error) {
  res.status(500).json({ success: false, message: "interanl server ereo" });
  console.log(error);
}
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find(); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});


router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    const user = await User.findById(userId);
    console.log("users", user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.put("/:userId", async (req, res) => {
  const { userId } = req.params;
  const updatedData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    if (updatedUser) {
      res.json(updatedUser); 
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error });
  }
});
module.exports = router;
