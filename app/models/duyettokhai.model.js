module.exports = (sequelize, Sequelize) => {
    const Duyettokhai = sequelize.define("duyet_to_khai", {
        tentrangthai: {
            type: Sequelize.STRING,
            //allowNull: false
        }
    });
    return Duyettokhai;
};