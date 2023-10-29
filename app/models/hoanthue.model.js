// thông tin hoàn trả thuế
// bao gồm: hình thức hoàn trả (ngân hàng | tiền mặt ...)
// hình thức hoàn trả: chuyển khoản
module.exports = (sequelize, Sequelize) => {
    const Hoantrathue = sequelize.define("hoantrathue", {
        tentk: {
            type: Sequelize.STRING,
            allowNull: false
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