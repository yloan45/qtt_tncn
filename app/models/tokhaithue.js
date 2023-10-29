module.exports = (sequelize, Sequelize) => {
    const Tokhaithue = sequelize.define("to_khai_thue", {
      fullname: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      dienthoai: {
        type: Sequelize.INTEGER,
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
      namkekhai: {
        type: Sequelize.STRING
      },
      tuthang: {
        type: Sequelize.STRING
      },
      denthang: {
        type: Sequelize.STRING
      },
      ct22: {
        type: Sequelize.DECIMAL(10,2),
      },
      ct23: {
        type: Sequelize.DECIMAL(10,2),
      },
      ct24: {
        type: Sequelize.DECIMAL
      },
      ct25: {
        type: Sequelize.DECIMAL
      },
      ct26: {
        type: Sequelize.DECIMAL
      },
      ct27: {
        type: Sequelize.INTEGER
      },
      ct28: {
        type: Sequelize.DECIMAL
      },
      ct29: {
        type: Sequelize.DECIMAL
      },
      ct30: {
        type: Sequelize.DECIMAL
      },
      ct31: {
        type: Sequelize.DECIMAL
      },
      ct32: {
        type: Sequelize.DECIMAL
      },
      ct33: {
        type: Sequelize.DECIMAL
      },
      ct34: {
        type: Sequelize.DECIMAL
      },
      ct35: {
        type: Sequelize.DECIMAL
      },
      ct36: {
        type: Sequelize.DECIMAL
      },
      ct37: {
        type: Sequelize.DECIMAL
      },
      ct38: {
        type: Sequelize.DECIMAL
      },
      ct39: {
        type: Sequelize.DECIMAL
      },
      ct40: {
        type: Sequelize.DECIMAL
      },
      ct41: {
        type: Sequelize.DECIMAL
      },
      ct42: {
        type: Sequelize.DECIMAL
      },
      ct43: {
        type: Sequelize.DECIMAL
      },
      ct44: {
        type: Sequelize.DECIMAL
      },
      ct45: {
        type: Sequelize.DECIMAL
      },
      ct46: {
        type: Sequelize.DECIMAL
      },
      ct47: {
        type: Sequelize.DECIMAL
      },
      ct48: {
        type: Sequelize.DECIMAL
      },
      ct49: {
        type: Sequelize.DECIMAL
      },
    });
    return Tokhaithue;
  };
  