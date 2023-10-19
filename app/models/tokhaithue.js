module.exports = (sequelize, Sequelize) => {
    const Tokhaithue = sequelize.define("tokhaithue", {
      fullname: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      tokhai: {
        type: Sequelize.STRING
      },
      coquanqtt: {
        type: Sequelize.STRING
      },
      namekekhai: {
        type: Sequelize.STRING
      },
      tuthang: {
        type: Sequelize.STRING
      },
      denthang: {
        type: Sequelize.STRING
      },
      ct22: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct23: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct24: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct25: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct26: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct27: {
        type: Sequelize.INTEGER
      },
      ct28: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct29: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct30: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct31: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct32: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct33: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct34: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct35: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct36: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct37: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct38: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct39: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct40: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct41: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct42: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct43: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct44: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct45: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct46: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct47: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct48: {
        type: Sequelize.DECIMAL(11, 10)
      },
      ct49: {
        type: Sequelize.DECIMAL(11, 10)
      },
    });
    return Tokhaithue;
  };
  