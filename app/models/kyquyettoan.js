module.exports = (sequelize, Sequelize) => {
    const Kyquyettoan = sequelize.define("ky_quyet_toan", {
        trangthai: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,                // mặc định không mở
        },
        ngaymo: {
            type: Sequelize.STRING,
        },
        ngaydong: {
            type: Sequelize.STRING
        },
        ngaymotochuc: {
            type: Sequelize.STRING,
        },
        ngaydongtochuc: {
            type: Sequelize.STRING
        },
     
    });
    return Kyquyettoan;
};
