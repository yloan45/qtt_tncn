module.exports = (sequelize, Sequelize) => {
  const Tochuckekhaithue = sequelize.define("upload_excel", {
    hoten: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Tên nhân viên không được để trống"
        }
      }
    },
    cccd: {
      type: Sequelize.STRING,
      allowNull: false
    },
    masothue: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    dienthoai: {
      type: Sequelize.STRING,
      allowNull: false
    },
    diachi: {
      type: Sequelize.STRING
    },
    vitricongviec: {
      type: Sequelize.STRING
    },
    hopdonglaodong: {
      type: Sequelize.STRING,
      allowNull: false
    },
    tuthang: {
      type: Sequelize.STRING,
      allowNull: false
    },
    denthang: {
      type: Sequelize.STRING,
      allowNull: false
    },
    khautruthue: {
      type: Sequelize.STRING,
      allowNull: false
    },
    muckhautru: {
      type: Sequelize.STRING,
      allowNull: false
    },
    mucluong: {
      type: Sequelize.STRING,
      allowNull: false
    },
    dakhautru: {
      type: Sequelize.STRING,
      allowNull: false
    },
    tonghtunhap: {
      type: Sequelize.STRING,
      allowNull: false
    },
    ghichu: {
      type: Sequelize.STRING
    }
  });
  return Tochuckekhaithue;
};