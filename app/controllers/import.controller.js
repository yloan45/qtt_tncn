
const db = require("../models");
const { sequelize } = require('../models'); // Adjust the path accordingly
const mailer = require('../utils/mailer');
const readXlsxFile = require("read-excel-file/node");
const Canhan = db.canhan;
const User = db.user;
const Diachi = db.diachi;
const bcrypt = require("bcryptjs");
require('dotenv/config');
const crypto = require('crypto');

// random password
function generateRandomPassword() {
    return crypto.randomBytes(4).toString('hex');
}

function removeAccents(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

let counter = 1;

function generateUsername(fullname) {
    const usernameWithoutAccents = removeAccents(fullname);
    const usernameWithoutSpaces = usernameWithoutAccents.replace(/\s/g, ""); // Remove spaces
    const uniqueSuffix = counter++;
    return `${usernameWithoutSpaces}-${uniqueSuffix}`;
}

const upload = async (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send("Please upload an excel file!");
        }

        let path = __basedir + "/uploads/excel/" + req.file.filename;
        readXlsxFile(path).then(async (rows) => {
            try {
                rows.shift();

                const createCanhan = await sequelize.transaction(async (t) => {
                    const canhan = await Canhan.bulkCreate(rows.map(row => ({
                        fullname: row[1],
                        masothue: row[2],
                        cccd: row[3],
                        email: row[4],
                        phone: row[5],
                        phuthuoc: row[6],
                        cqqtthue: row[7],
                    })), { transaction: t });

                    const diachi = await Diachi.bulkCreate(rows.map((row, index) => ({
                        xa_phuong: row[8],
                        quan_huyen: row[9],
                        tinh_tp: row[10],
                        caNhanId: canhan[index].id,
                    })), { transaction: t });

                    const users = await Promise.all(canhan.map(async (c) => {
                        const unhashedPassword = generateRandomPassword();                  // random password
                        const hashedPassword = bcrypt.hashSync(unhashedPassword, 8);        // mã hóa password
                        const user = await User.create({
                            username: generateUsername(c.fullname),
                            password: hashedPassword,
                            caNhanId: c.id,
                        }, { transaction: t });

                        await user.setRoles([1], { transaction: t });

                        try {
                            await mailer.sendMail(c.email, "Tạo tài khoản thành công",
                                `Xin chào ${c.fullname} <br>
                                Bạn vừa được tạo tài khoản Quyết toán thuế TNCN thành công! <br>
                                Tài khoản đăng nhập hệ thống của bạn:<br>
                                - username: ${user.username} <br>
                                - password: ${unhashedPassword}`);
                            console.log(`Email sent successfully to ${c.email}`);
                        } catch (emailError) {
                            console.error(`Error sending email to ${c.email}:`, emailError);
                        }

                        return user;
                    }));

                    return { canhan, diachi, users };
                });
                res.redirect('/list-user');
            } catch (error) {
                console.error("Error in file upload:", error);
                res.status(500).send({
                    message: "Fail to import data into the database!",
                    error: error.message,
                });
            }
        });
    } catch (error) {
        console.error("Error in file upload:", error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};


module.exports = {
    importCanhan: upload,
};