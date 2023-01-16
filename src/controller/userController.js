const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { findOneAndDelete } = require("../models/User");

// registration process
const regisTration = async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, process.env.Secret),
    phoneNo: req.body.phoneNo,
    avatar: `/images/${req.file?.filename}`,
    isAdmin: req.body.isAdmin ?? false,
  });

  try {
    const saveUser = await newUser.save();
    let token = await jwt.sign(
      { _id: saveUser._id.toString() },
      process.env.Secret
    );
    saveUser.tokens = saveUser.tokens.concat({ token: token });
    await saveUser.save();
    res.status(201).json({ saveUser, token });
  } catch (error) {
    res.status(500).json(error);
  }
};

// login process
const login = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) return res.status(500).json("Wrong Credentials!");
    const hashPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.Secret
    );
    const OriginalPassword = hashPassword.toString(CryptoJS.enc.Utf8);
    if (OriginalPassword !== req.body.password)
      return res.status(500).json("Wrong Credentials!");
    const { password, ...others } = user._doc;
    let token = await jwt.sign(
      { _id: user._id.toString() },
      process.env.Secret
    );
    user.tokens = user.tokens.concat({ token: token });
    await user.save();
    res.status(200).json({ ...others, token });
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateUserProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  if (req.file?.fieldname) updates.push("avatar");
  const allowedUpadates = ["name", "phoneNo", "avatar"];
  const isValidUpdates = updates.every((update) =>
    allowedUpadates.includes(update)
  );
  if (!isValidUpdates) {
    return res.status(403).json("Invalid body pass which is not exist");
  }
  try {
    let obj = {};
    updates.forEach((update) => {
      if (update === "avatar") obj[update] = `/images/${req.file.filename}`;
      else obj[update] = req.body[update];
    });
    const data = await User.findOneAndUpdate({ _id: req.params.id }, obj, {
      new: true,
    });
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
};

const logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.status(200).send("logout user!");
  } catch (error) {
    res.status(500).send();
  }
};

// deleteuser
const deleteUser = async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).send(req.user);
    // res.status(200).json("user deleted successfully!");
  } catch (error) {
    res.status(500).json(error);
  }
};

// listofAlluser
const listofAlluser = async (req, res) => {
  try {
    const data = await User.find({ isAdmin: false, isActive: true });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

const userDetails = async (req, res) => {
  try {
    const data = await User.find({
      isAdmin: false,
      isActive: true,
      _id: req.params.id,
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

const activePermission = async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpadates = ["isActive"];
  const isValidUpdates = updates.every((update) =>
    allowedUpadates.includes(update)
  );

  if (!isValidUpdates) {
    return res.status(403).send("Invalid body pass which is not exist");
  }
  try {
    let obj = {};
    updates.forEach((update) => {
      obj[update] = req.body[update];
    });
    // await req.user.save();
    const data = await User.findOneAndUpdate({ _id: req.params.id }, obj, {
      new: true,
    });
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteSomeOne = async (req, res) => {
  try {
    await User.findOneAndDelete({ email: req.body.email });
    res.status(200).json("user deleted successfully!");
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports = {
  regisTration,
  login,
  logoutUser,
  deleteUser,
  updateUserProfile,
  listofAlluser,
  userDetails,
  activePermission,
  deleteSomeOne,
};
