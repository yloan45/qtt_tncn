module.exports = (sequelize, Sequelize) => {
    const Diachi = sequelize.define("dia_chi", {
        tinh_tp: {
            type: Sequelize.STRING,
        },
        quan_huyen: {
            type: Sequelize.STRING,
        },
        xa_phuong: {
            type: Sequelize.STRING, 
        }
    });
    return Diachi;
};