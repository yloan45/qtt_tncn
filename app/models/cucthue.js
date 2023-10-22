module.exports = (sequelize, Sequelize) => {
    const Cucthue = sequelize.define("cucthue", {
      cucthue: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Cuc thue khong duoc de trong!"
          }
        }
      }
    });
    return Cucthue;
  };
  