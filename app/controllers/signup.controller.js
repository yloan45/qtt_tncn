const db = require("../models");
const config = require("../config/auth.config");
require('dotenv/config');
const mailer = require('../utils/mailer');

const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
const Canhan = db.canhan;
const Tochuc = db.tochuc;


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


exports.CNsignup = async (req, res) => {
    // Save User to Database
    try {
        const user = await User.create({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
        });

        const canhan = await Canhan.create({
            email: req.body.email,
            masothue: req.body.masothue,
            address: req.body.address,
            cccd: req.body.cccd,
            phone: req.body.phone,
            cqqtthue: req.body.cqqtthue,
            soluong: req.body.soluong,
            fullname: req.body.fullname,
            userId: user.id,
        });

        if (req.body.roles) {
            const roles = await Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles,
                    },
                },
            });

            // role user = 1 => role canhan
            const result = user.setRoles([1]);
            if (result) res.send({ message: "User registered successfully!" });
        }

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.TCsignup = async (req, res) => {
    // Save User to Database: 7 - not null
    try {
        const user = await User.create({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
        });

        const tochuc = await Tochuc.create({
            email: req.body.email,
            name: req.body.names,
            masothue: req.body.masothue,
            address: req.body.address,
            phone: req.body.phone,
            cqqtthue: req.body.cqqtthue,
            nhanvien: req.body.nhanvien,
            daidien: req.body.daidien,
            userId: user.id,
        });

        if (req.body.roles) {
            const roles = await Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles,
                    },
                },
            });

            // role user = 2 => role tochuc
            const result = user.setRoles([2]);
            if (result){
                res.redirect("/")
            }
        }

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


