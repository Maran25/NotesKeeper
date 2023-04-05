const { User } = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.json({ error: "Please Fill all the Fields" });
  }
  let isNewUser;

  try {
    isNewUser = await User.findOne({ email });
  } catch (error) {
    return res.json({ error: error.message });
  }

  if (isNewUser) {
    return res.json({ error: "User already exists" });
  }

  const rounds = await bcrypt.genSalt(8);
  const hashedPassword = await bcrypt.hash(password, rounds);

  const user = await User.create({ username, email, password: hashedPassword });

  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3h" });
  res.cookie("token", token, { httpOnly: true, maxAge: 10800000 });  // REMOVED DOMAIN NAME

  return res.status(200).json({ token, ...payload });
};


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  let isExistingUser;

  try {
    isExistingUser = await User.findOne({ email });
    console.log(isExistingUser);
  } catch (error) {
    return res.status(401).json({ error: "Unable to find existing user" });
  }

  if (!isExistingUser) {
    return res.status(401).json({ error: "User does not exist" });
  }

  const isRightPass = await bcrypt.compare(password, isExistingUser.password);

  if (isRightPass) {
    const payload = {
      userId: isExistingUser._id,
      username: isExistingUser.username,
      email: isExistingUser.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });
    res.cookie("token", token, { httpOnly: true, maxAge: 10800000 });
    return res.status(200).json({ token, ...payload });
  } else {
    return res.status(401).json({ error: "Incorrect Password" });
  }
};


module.exports = { register, login };
