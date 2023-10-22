module.exports = (sequelize, Sequelize) => {
  const Chicucthue = sequelize.define("chicucthue", {
    chicucthue: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Chi cuc thue khong duoc de trong!"
        }
      }
    }
  });
  return Chicucthue;
};
