const express = require("express");
const cors = require("cors");
const configViewEngine = require('./app/config/view.engine');
const app = express();
const session = require("express-session");

global.__basedir = __dirname + "/.";

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
configViewEngine(app);

// database
const db = require("./app/models");

const homeRoutes = require('./app/routes/index.routes');

app.use('/', homeRoutes);


db.sequelize.sync();

// xóa và tạo lại dữ liệu
/*
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});
*/


app.use(
  session({
    secret: "your secret",
    resave: false,
    saveUninitialized: true
  })
);

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

