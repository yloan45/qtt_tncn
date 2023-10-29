module.exports = (sequelize, Sequelize) => {
    const Loaitokhai = sequelize.define("loai_to_khai", {
        tenloai: {
            type: Sequelize.STRING,
            allowNull: false
        },
    });
    return Loaitokhai;
};