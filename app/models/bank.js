module.exports = (sequelize, Sequelize) => {
    const Bank = sequelize.define("ngan_hang", {
        name: {
            type: Sequelize.STRING,      
        },
    });
    return Bank;
};
