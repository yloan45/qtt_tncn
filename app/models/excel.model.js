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
    tongthunhap: {
      type: Sequelize.STRING,
      allowNull: false
    },
    thunhaptinhthue: {
      type: Sequelize.STRING,
      allowNull: false
    },
    namkekhai: {
      type: Sequelize.STRING,
      allowNull: false
    },
    ghichu: {
      type: Sequelize.STRING
    }
  });
  return Tochuckekhaithue;
};