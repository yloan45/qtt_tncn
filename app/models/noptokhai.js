module.exports = (sequelize, Sequelize) => {
    const Noptokhai = sequelize.define("nop_to_khai", {
        fullname: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        tokhai: {
            type: Sequelize.STRING
        },
        filename: {
            type: Sequelize.STRING,
        },
        filePath: {
            type: Sequelize.STRING,
        }
    });
    return Noptokhai;
};
