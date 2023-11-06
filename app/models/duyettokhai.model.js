module.exports = (sequelize, Sequelize) => {
    const Duyettokhai = sequelize.define("duyet_to_khai", {
        username: {
            type: Sequelize.STRING
        }
    });
    return Duyettokhai;
};