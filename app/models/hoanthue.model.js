module.exports = (sequelize, Sequelize) => {
    const Hoantrathue = sequelize.define("hoan_tra_thue", {
        tonghoantra: {
            type: Sequelize.STRING
        },
        trangthai: {
            type: Sequelize.STRING,
        }
    });
    return Hoantrathue;
};