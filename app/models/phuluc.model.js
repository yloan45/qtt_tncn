/*module.exports = (sequelize, Sequelize) => {
    const Phuluc = sequelize.define("phu_luc", {
        tenphuluc: {
            type: Sequelize.STRING,
        },
        files: {
            type: Sequelize.JSON, // Sử dụng kiểu dữ liệu JSON để lưu trữ thông tin về các file
        }
    });
    return Phuluc;
};
*/
module.exports = (sequelize, Sequelize) => {
    const Phuluc = sequelize.define("phu_luc", {
        tenphuluc: {
            type: Sequelize.STRING,
        }
    });
    return Phuluc;
};