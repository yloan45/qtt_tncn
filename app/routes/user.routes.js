const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const { getAllMST, deleteUser, deleteAll, getAllUser, update } = require("../controllers/auth.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.get("/listall", getAllMST);
  app.get("/delete/:id", deleteUser);
  
  app.get("/list-user", getAllUser);
  app.post("/update/:id", update);

  app.get("/tokhai", (req, res) => {
    res.render("nguoidung/tokhai.ejs")
  })
  /*
  app.get("/upload-file", (req, res) => {
    res.render("tochuc/upload")
  });
*/
  //app.get("/send-file", excelController.getTutorials);

  //app.post("/upload", upload.single("file"), excelController.upload);
};
