// file.model.js
module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("file", {
        filename: {
            type: Sequelize.STRING,
        },
        filePath: {
            type: Sequelize.STRING,
        },
        fieldName: {
            type: Sequelize.STRING,
        },
    });

    return File;
};
