module.exports = (sequelize, Sequelize) => {
    const Chicucthue = sequelize.define("chicucthue", {
      chicucthue: {
        type: Sequelize.STRING
      }
    });
    return Chicucthue;
  };
  