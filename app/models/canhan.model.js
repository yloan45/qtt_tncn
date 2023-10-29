module.exports = (sequelize, Sequelize) => {
  const Canhan = sequelize.define("ca_nhan", {
    masothue: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Ma so thue khong duoc de trong!"
        }
      }
    },

    fullname: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Fullname khong duoc de trong"
        }
      }
    },

    cccd: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Can cuoc cong dan khong duoc de trong"
        }
      }
    },
    phone: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "So dien thoai khong duoc de trong"
        }
      }
    },
    phuthuoc: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
         }
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Email khong duoc de trong"
        }
      }
    },
    cqqtthue: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Co quan quyet toan thue khong duoc de trong"
        }
      }
    }
  });
  return Canhan;
};
