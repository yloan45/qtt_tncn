module.exports = (sequelize, Sequelize) => {
  const Excelupload = sequelize.define("upload_excel", {
    tennv: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Luong khong duoc de trong"
        }
      }
    },
    masothue: {
      type: Sequelize.STRING
    },
    namsinh: {
      type: Sequelize.STRING
    },
    vitri: {
      type: Sequelize.STRING
    },
    diachi: {
      type: Sequelize.STRING
    },
    dienthoai: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    luong: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Luong khong duoc de trong"
        }
      }
    }
  });
  return Excelupload;
};