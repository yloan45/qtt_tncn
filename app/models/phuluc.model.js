module.exports = (sequelize, Sequelize) => {
    const Phuluc = sequelize.define("phu_luc", {
        ten: {
            type: Sequelize.STRING,
            allowNull: false
        },
        filename: {
            type: Sequelize.STRING,
           
        },
        filepath: {
            type: Sequelize.STRING, 
        }
    });
    return Diachi;
};