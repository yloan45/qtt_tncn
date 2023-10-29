module.exports = (sequelize, Sequelize) => {
    const Trangthai = sequelize.define("trang_thai_xu_li", {
      tentrangthai: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  
    return Trangthai;
  };
  