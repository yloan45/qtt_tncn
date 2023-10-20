const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const { getAllMST, deleteUser, deleteAll, getAllUser, update } = require("../controllers/auth.controller");
 const upload = require("../middleware/upload");
 const excelController = require("../controllers/excel.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/listall", getAllMST);
  app.get("/delete/:id", deleteUser);
  
  app.get("/list-user", getAllUser);
  app.post("/update/:id", update);

  app.get("/tokhai", (req, res) => {
    res.render("nguoidung/tokhai.ejs")
  })
  
  app.get("/upload-file", (req, res) => {
    res.render("tochuc/upload")
  });
  app.get("/getAll", excelController.getAllExcelFile);

  app.post("/upload", upload.single("file"), excelController.upload);
  
};
