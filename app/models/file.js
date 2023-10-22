module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("File", {
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
    return File;
};
