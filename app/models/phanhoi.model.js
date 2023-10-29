module.exports = (sequelize, Sequelize) => {
    const Phanhoi = sequelize.define("phan_hoi", {
        noidung: {
            type: Sequelize.STRING,
            allowNull: false
        },
    });
    return Phanhoi;
};

// người dùng cá nhân phản hồi đến admin về doanh nghiệp/tổ chức kê khai trả tiền lương/tiền công
