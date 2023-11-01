module.exports = (sequelize, Sequelize) => {
  const Tochuckekhaithue = sequelize.define("upload_excel", {
    tennv: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Tên nhân viên không được để trống"
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
    },
    donvitraluong: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Don vi tra luong khong duoc de trong"
        }
      }
    },
    ngaycapnhat: {
      type: Sequelize.DATEONLY
    },
    bienche: {
      type: Sequelize.BOOLEAN
    },
    ghichu: {
      type: Sequelize.STRING
    }
  });
  return Tochuckekhaithue;
};