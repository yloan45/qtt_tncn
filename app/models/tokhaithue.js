module.exports = (sequelize, Sequelize) => {
    const Tokhaithue = sequelize.define("to_khai_thue", {
      fullname: {
        type: Sequelize.STRING
      },
      masothue: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      dienthoai: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING
      },
      ct23: {
        type: Sequelize.STRING
      },
      ct24: {
        type: Sequelize.STRING
      },
      ct25: {
        type: Sequelize.STRING
      },
      ct26: {
        type: Sequelize.STRING
      },
      ct27: {
        type: Sequelize.INTEGER
      },
      ct28: {
        type: Sequelize.STRING
      },
      ct29: {
        type: Sequelize.STRING
      },
      ct30: {
        type: Sequelize.STRING
      },
      ct31: {
        type: Sequelize.STRING
      },
      ct32: {
        type: Sequelize.STRING
      },
      ct33: {
        type: Sequelize.STRING
      },
      ct34: {
        type: Sequelize.STRING
      },
      ct35: {
        type: Sequelize.STRING
      },
      ct36: {
        type: Sequelize.STRING
      },
      ct37: {
        type: Sequelize.STRING
      },
      ct38: {
        type: Sequelize.STRING
      },
      ct39: {
        type: Sequelize.STRING
      },
      ct40: {
        type: Sequelize.STRING
      },
      ct41: {
        type: Sequelize.STRING
      },
      ct42: {
        type: Sequelize.STRING
      },
      ct43: {
        type: Sequelize.STRING
      },
      ct44: {
        type: Sequelize.STRING
      },
      ct45: {
        type: Sequelize.STRING
      },
      ct46: {
        type: Sequelize.STRING
      },
      ct47: {
        type: Sequelize.STRING
      },
      ct48: {
        type: Sequelize.STRING
      },
      ct49: {
        type: Sequelize.STRING
      },
      ngayTao: {
        type: Sequelize.DATE
      }
    });
    return Tokhaithue;
  };
  