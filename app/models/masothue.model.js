module.exports = (sequelize, Sequelize) => {
    const Masothue = sequelize.define("masothue", {
      masothue: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      }
    });
    return Masothue;
  };
  