module.exports = (sequelize, Sequelize) => {
    const Phuluc = sequelize.define("phuluc", {
      name: {
        type: Sequelize.STRING
      },
      filename: {
        type: Sequelize.STRING,
      }
    });
  
    return Phuluc;
  };
  