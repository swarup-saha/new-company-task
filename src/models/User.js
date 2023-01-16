const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
let UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNo: { type: String, required: true },
    avatar: { type: String },
    isActive: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    tokens: [
      {
        _id: false,
        token: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

// UserSchema.methods.toJSON = function () {
//   const user = this;
//   const userObject = user.toObject();

//   delete userObject.password;
//   delete userObject.tokens;

//   return userObject;
// };

// token
// UserSchema.methods.generateAuthToken = async function () {
//   console.log("hiiii", user);
//   let user = this;
//   let token = await jwt.sign({ _id: user._id.toString() }, process.env.Secret);
//   user.tokens = user.tokens.concat({ token: token });
//   await user.save();
//   return token;
// };

// login
// UserSchema.statics.findByCredentials = async (email, password) => {
//   const user = await User.findOne({
//     email,
//   });
//   if (!user) return res.status(500).json("Wrong Credentials!");
//   const hashPassword = CryptoJS.AES.decrypt(user.password, process.env.Secret);
//   const OriginalPassword = hashPassword.toString(CryptoJS.enc.Utf8);
//   if (OriginalPassword !== password)
//     return res.status(500).json("Wrong Credentials!");
//   console.log("hiiii", user);
//   return user;
// };

UserSchema.pre("remove", async function (next) {
  // let user = this;
  next();
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
