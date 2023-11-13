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


db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.canhan = require("../models/canhan.model.js")(sequelize, Sequelize);
db.tochuc = require("../models/tochuc.model.js")(sequelize, Sequelize);
db.admin = require("../models/admin.model.js")(sequelize,Sequelize);
db.noptokhai = require("../models/noptokhai.js")(sequelize, Sequelize);     // upload file
db.tochuckekhaithue = require("../models/excel.model.js")(sequelize, Sequelize);  //upload file excel
db.tokhaithue = require("../models/tokhaithue.js")(sequelize, Sequelize);
db.loaitokhai = require("../models/loaitokhai.model.js")(sequelize, Sequelize);
db.trangthaixuly = require("../models/trangthaixuly.js")(sequelize, Sequelize);
db.duyettokhai = require("../models/duyettokhai.model.js")(sequelize, Sequelize);
db.diachi = require("../models/diachi.model.js")(sequelize, Sequelize);
db.phuluc = require("../models/phuluc.model.js")(sequelize, Sequelize);
db.hoantrathue = require("../models/hoanthue.model.js")(sequelize, Sequelize);
db.cucthue = require("../models/cucthue.model.js")(sequelize, Sequelize);
db.chicucthue = require("../models/chicucthue.model.js")(sequelize, Sequelize);
db.phanhoi = require("../models/phanhoi.model.js")(sequelize, Sequelize);
db.chitietphanhoi = require("../models/chitietphanhoi.model.js")(sequelize, Sequelize);


db.file = require("../models/file.model.js")(sequelize,Sequelize);


db.phuluc.hasMany(db.file, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.file.belongsTo(db.phuluc, {
  onUpdate: "CASCADE",
});

// cá nhân - tờ khai - cá nhân có thể tạo nhiều tờ khai
db.canhan.hasMany(db.tokhaithue, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.tokhaithue.belongsTo(db.canhan, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// tờ khai thuế chỉ có 1 trạng thái xử lý
db.tokhaithue.belongsTo(db.trangthaixuly, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.trangthaixuly.hasOne(db.tokhaithue, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// admin - duyệt tờ khai - admin duyệt được nhiều tờ khai
db.admin.hasMany(db.duyettokhai, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.duyettokhai.belongsTo(db.admin,{
  onUpdate: "CASCADE",
});

// tờ khai và duyệt tờ khai -  tờ khai có thể có nhiều bản ghi lịch sử duyệt
db.tokhaithue.hasMany(db.duyettokhai, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.duyettokhai.belongsTo(db.tokhaithue, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// cá nhân - địa chỉ
db.canhan.hasOne(db.diachi, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.diachi.belongsTo(db.canhan, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// tổ chức - địa chỉ
db.tochuc.hasMany(db.diachi, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.diachi.belongsTo(db.tochuc,{
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// cá nhân - tổ chức - many - many
db.canhan.belongsToMany(db.tochuc,{
  through: 'noi_lam_viec'
});
db.tochuc.belongsToMany(db.canhan,{
  through: 'noi_lam_viec'
});

// tờ khai - phụ lục -> tờ khai có nhiều phụ lục, phụ lục chỉ thuộc về 1 tờ khai
db.tokhaithue.hasMany(db.phuluc, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.phuluc.belongsTo(db.tokhaithue, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// tờ khai - thông tin hoàn trả thuế
db.tokhaithue.hasOne(db.hoantrathue,{
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.hoantrathue.belongsTo(db.tokhaithue,{
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// cục thuế- chi cục thuế- cá nhân - địa chỉ - tổ chức
db.diachi.hasOne(db.cucthue,{
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.cucthue.belongsTo(db.diachi,{
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.cucthue.hasMany(db.chicucthue,{
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.chicucthue.belongsTo(db.cucthue,{
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});


db.canhan.belongsTo(db.cucthue,{
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.cucthue.hasMany(db.canhan, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.tochuc.belongsTo(db.cucthue,{
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.cucthue.hasMany(db.tochuc, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// tổ chức upload file excel
db.tochuc.hasMany(db.tochuckekhaithue, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.tochuckekhaithue.belongsTo(db.tochuc, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// cá nhân upload tờ khai thuế
db.canhan.hasMany(db.noptokhai, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.noptokhai.belongsTo(db.canhan, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Many - Many
db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

// canhan
db.canhan.hasOne(db.user, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.user.belongsTo(db.canhan, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// tochuc
db.tochuc.hasOne(db.user, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.user.belongsTo(db.tochuc, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});


// admin
db.admin.hasOne(db.user, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.user.belongsTo(db.admin, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.tokhaithue.belongsTo(db.loaitokhai, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

db.loaitokhai.hasMany(db.tokhaithue, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.canhan.hasMany(db.phanhoi, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.phanhoi.belongsTo(db.canhan,{
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.phanhoi.hasMany(db.chitietphanhoi, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.chitietphanhoi.belongsTo(db.phanhoi, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.ROLES = ["canhan", "admin", "tochuc"];

module.exports = db;
