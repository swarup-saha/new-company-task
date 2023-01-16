const router = require("express").Router();
const {
  regisTration,
  login,
  deleteUser,
  logoutUser,
  updateUserProfile,
} = require("../controller/userController");
const multer = require("multer");
const { body } = require("express-validator");
const { multerStorage } = require("../utils/fileUpload");
const { verifyTokenAndAutherization } = require("../utils/verifyToken");
let upload = multer({ storage: multerStorage("/images") });

// Register
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("invalid Email."),
    body("name").not().isEmpty(),
    body("phoneNo").isLength({ min: 10, max: 10 }),
    body("password").isLength({ min: 6 }),
    body("avatar").not().isEmpty(),
  ],
  upload.single("avatar"),
  regisTration
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("invalid Email."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6."),
  ],
  login
);

router.patch(
  "/proile/update/:id",
  verifyTokenAndAutherization,
  updateUserProfile
);
router.post("/logout/:id", verifyTokenAndAutherization, logoutUser);
router.delete("/delete/:id", verifyTokenAndAutherization, deleteUser);
module.exports = router;
