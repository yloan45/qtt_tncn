module.exports = (sequelize, Sequelize) => {
    const Chicucthue = sequelize.define("chi_cuc_thue", {
        tenchicucthue: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return Chicucthue;
};