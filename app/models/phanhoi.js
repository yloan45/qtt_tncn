module.exports = (sequelize, Sequelize) => {
    const Phanhoi = sequelize.define("phanhoi", {
      noidung: {
        type: Sequelize.STRING
      }
    });
    return Phanhoi;
  };
  