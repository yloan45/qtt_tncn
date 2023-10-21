const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );
  
  app.get("/admin/signin", (req, res) => {
    res.render('admin/auth/login');
  });

  app.get("/admin/homepage", (req, res) => {
    res.render('admin/homepage');
  });

  app.post("/admin", controller.signin);
  
  app.get("/update/:id", controller.findOne);

  app.get("/create-user",  (req, res) =>{
    res.render('admin/create');
  })
  
};
