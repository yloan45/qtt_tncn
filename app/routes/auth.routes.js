const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const { TCsignup } = require("../controllers/signup.controller");
const { verifyToken } = require("../middleware/authJwt");

module.exports = function (app) {
app.use(function (req, res, next) {
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
});
  
app.use((req, res, next) => {
    if (req.session.user) {
      res.locals.user = req.session.user;
    } else {
      res.locals.user = null;
    }
    next();
});

app.post("/api/auth/signup",[verifySignUp.checkCaNhan, verifySignUp.checkRolesExisted], controller.CaNhanSignup);     // cá nhân
app.post("/auth/create-tochuc",[verifySignUp.checkToChuc, verifySignUp.checkRolesExisted], controller.ToChucSignup);  // doanh nghiệp
app.post("/register-admin", controller.AdminSignup);    // admin


app.post("/tochuc/login", controller.TochucSignin);     // login doanh nghiệp
app.post("/login", controller.signin);                  // admin login
app.post("/canhan/login", controller.CanhanSignin);     // cá nhân login
app.get("/api/auth/signout", controller.signout);       // đăng xuất tài khoản


app.get("/tochuc/login", (req, res) => {                // form login                                
  res.render("tochuc/login");
});






};
