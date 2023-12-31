const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const { TCsignup } = require("../controllers/signup.controller");
const { verifyToken } = require("../middleware/authJwt");
const { changePassword } = require("../controllers/canhan.controller");
const { toChucChangePassword } = require("../controllers/tochuc.controller");

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

app.get('/canhan/login', (req, res) => {
  res.render('nguoidung/login');
});


app.get("/change-password", (req, res) => {
  res.render('nguoidung/changePassword');
});

app.post("/change-password/:id", changePassword);

app.post("/to-chuc-doi-mat-khau/:id", toChucChangePassword);
app.get("/to-chuc-change-password", (req, res) => {
  res.render('tochuc/changePassword');
});

app.get("/quen-mat-khau", (req, res) => {
  res.render("tochuc/otp");
});

app.get("/lay-lai-mat-khau", (req, res) => {
  res.render("tochuc/forgotPassword");
});


};
