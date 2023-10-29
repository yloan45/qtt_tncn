const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const { getAllMST, deleteUser, getAllUser, update, findOne} = require("../controllers/tochuc.controller");
const upload = require("../middleware/excelUpload");
//const excelController = require("../controllers/excel.controller");
const tokhaithue = require("../controllers/tokhai.controller");
const uploadTokhai = require("../controllers/upload.controller");
const db = require("../models");
const File = db.file;
const userController = require("../controllers/upload.controller");


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });




};
