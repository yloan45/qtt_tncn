module.exports = (sequelize, Sequelize) => {
    const Masothue = sequelize.define("masothue", {
      masothue: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Ma so thue khong the de trong!"
          }
        }

      }
    });
    return Masothue;
  };
  