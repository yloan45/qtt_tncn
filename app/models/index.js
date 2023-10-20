const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require("./excel.model.js")(sequelize, Sequelize);
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.mst = require("../models/masothue.model.js")(sequelize, Sequelize);
db.cnUpload = require("../models/cnUpload.js")(sequelize, Sequelize);
db.tcUpload = require("../models/tcUpload.js")(sequelize, Sequelize);
db.cucthue = require("../models/cucthue.js")(sequelize, Sequelize);
db.chicucthue = require("../models/chicucthue.js")(sequelize, Sequelize);
db.phuluc = require("../models/phuluc.js")(sequelize, Sequelize);
db.tokhaithue = require("../models/tokhaithue.js")(sequelize, Sequelize);
db.phanhoi = require("../models/phanhoi.js")(sequelize, Sequelize);
db.ndkekhai = require("../models/ndKekhai.js")(sequelize, Sequelize);
//db.nganhnghe = require("./nganhnghe.js")(sequelize, Sequelize);


db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

// cá nhân upload => many - many

db.user.belongsToMany(db.cnUpload, {
  through: "canhan_uploads"
});
db.cnUpload.belongsToMany(db.user, {
  through: "canhan_uploads"
});

// tổ chức upload => many - many

db.user.belongsToMany(db.tcUpload, {
  through: "tochuc_uploads"
});
db.tcUpload.belongsToMany(db.user, {
  through: "tochuc_uploads"
});


// người dùng - mã số thuế => người dùng có 1 mã số thuế 
db.mst.hasOne(db.user,{
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.user.belongsTo(db.mst, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// cục thuế - chi cục thuế => cục thuế có nhiều chi cục
db.cucthue.hasMany(db.chicucthue,
  {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
db.chicucthue.belongsTo(db.cucthue, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});


// user - tờ khai thuế => tờ khai thuế có nhiều người dùng
db.user.belongsTo(db.tokhaithue,{
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.tokhaithue.hasMany(db.user,{
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});


// phụ lục - tờ khai thuế => 1 tờ khai thuế chỉ có 1 phụ lục
db.tokhaithue.belongsTo(db.phuluc, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.phuluc.hasMany(db.tokhaithue, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});


// user - phản hồi => cá nhân phản hồi 
db.phanhoi.hasMany(db.user, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.user.belongsTo(db.phanhoi, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});



// tổ chức up load file - nội dung file upload
db.tcUpload.belongsTo(db.ndkekhai, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.ndkekhai.hasMany(db.tcUpload, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});



db.ROLES = ["canhan", "admin", "tochuc"];

module.exports = db;
