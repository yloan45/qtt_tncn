module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define("admin", {
        macanbo: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "Ma can bo khong duoc de trong!"
                }
            }
        },
        masothue: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "Ma so thue khong duoc de trong!"
                }
            }
        },
        hoten: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Ho ten khong duoc de trong!"
                }
            }
        },
        coquanthue: {
            type: Sequelize.STRING,
            allowNull: false
        },
/*
        sdt: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
*/
        email: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return Admin;
};