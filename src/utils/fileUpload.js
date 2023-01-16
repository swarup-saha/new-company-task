const multer = require("multer");
const path = require("path");

const multerStorage = (imagePath) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      let img_path = imagePath ? imagePath : "/images";
      cb(null, path.join(__dirname, `../public${img_path}`));
    },
    filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}.png`);
    },
  });
};
module.exports = {
  multerStorage,
};
