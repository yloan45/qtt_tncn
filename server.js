const express = require("express");
const cors = require("cors");
const configViewEngine = require('./app/config/view.engine');
const app = express();

global.__basedir = __dirname + "/.";

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//use view engine ejs
configViewEngine(app);

// database
const db = require("./app/models");
const Role = db.role;


const homeRoutes = require('./app/routes/index.routes');
const session = require("express-session");
app.use('/', homeRoutes);


db.sequelize.sync();

// xóa và tạo lại dữ liệu
/*
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});
*/

const svgCaptcha = require("svg-captcha");
app.use(
  session({
    secret: "your secret",
    resave: false,
    saveUninitialized: true
  })
);
// routes
app.get("/captcha", function (req, res) {
  var captcha = svgCaptcha.create({
    noise: 0
  });
  req.session.captcha = captcha.text; //Save the session for the verification interface to get the text code
  res.type("svg");
  res.status(200).send(captcha.data);

});



require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
