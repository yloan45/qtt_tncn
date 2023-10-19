module.exports = (sequelize, Sequelize) => {
    const Cucthue = sequelize.define("cucthue", {
      cucthue: {
        type: Sequelize.STRING
      }
    });
    return Cucthue;
  };
  