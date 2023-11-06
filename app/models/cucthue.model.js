module.exports = (sequelize, Sequelize) => {
    const Cucthue = sequelize.define("cuc_thue", {
        tencucthue: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return Cucthue;
};