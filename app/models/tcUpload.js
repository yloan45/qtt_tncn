module.exports = (sequelize, Sequelize) => {
    const tcUpload = sequelize.define("tc_upload", {
      name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.INTEGER
      },
      email: { 
        type: Sequelize.STRING
      },
      tokhai: { 
        type: Sequelize.STRING
      },
      filename: {
        type: Sequelize.STRING
      }
    });
    return tcUpload;
  };
  