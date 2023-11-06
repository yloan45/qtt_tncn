module.exports = (sequelize, Sequelize) => {
    const Hoantrathue = sequelize.define("hoan_tra_thue", {
        tentk: {
            type: Sequelize.STRING
        },
        stk: {
            type: Sequelize.STRING,
           
        },
        nganhang: {
            type: Sequelize.STRING,
            
        }
    });
    return Hoantrathue;
};