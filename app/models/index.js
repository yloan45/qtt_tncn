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
// cục thuế
// chi cục thuế
// phụ lục
// phản hồi
// chi tiết phản hồi
/// thông tin hoàn trả thuế



// Many - Many
db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.tochuc.belongsToMany(db.canhan, {
  through: "noi_lam_viec"
})
db.canhan.belongsToMany(db.tochuc, {
  through: "noi_lam_viec"
});

/*
db.tochuc.belongsToMany(db.diachi, {
through: "tochuc_diachi"
});

db.diachi.belongsToMany(db.tochuc, {
  through: "tochuc_diachi"
});

db.canhan.belongsToMany(db.diachi, {
  through: "canhan_diachi"
});
db.diachi.belongsToMany(db.canhan, {
  through: "canhan_diachi"
});
*/

// canhan
db.canhan.hasOne(db.user, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.user.belongsTo(db.canhan, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.noptokhai.belongsTo(db.canhan, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

db.tokhaithue.belongsTo(db.canhan, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
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

db.tochuckekhaithue.belongsTo(db.tochuc, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

// admin
db.admin.hasOne(db.user, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.user.belongsTo(db.admin, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.admin.hasMany(db.duyettokhai, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.duyettokhai.hasOne(db.trangthaixuly, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.trangthaixuly.hasMany(db.tokhaithue, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

db.tokhaithue.belongsTo(db.trangthaixuly, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.loaitokhai.hasMany(db.tokhaithue, {
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

db.tokhaithue.belongsTo(db.loaitokhai, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

/**/
db.canhan.belongsTo(db.diachi, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

db.diachi.hasMany(db.canhan, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});





db.ROLES = ["canhan", "admin", "tochuc"];


module.exports = db;
