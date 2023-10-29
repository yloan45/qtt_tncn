module.exports = (sequelize, Sequelize) => {
    const Chitietphanhoi = sequelize.define("chi_tiet_phan_hoi", {
        ngaynhan: {
            type: Sequelize.STRING,
            allowNull: false
        },
    });
    return Chitietphanhoi;
};
