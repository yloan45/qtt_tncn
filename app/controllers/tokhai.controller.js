const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Tokhai = db.tokhaithue;
const Op = db.Sequelize.Op;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');


const createTokhai = async (req, res, next) =>  {
    const {userId, fullname, address, phone, email, year, tokhai, loaitokhai, cucthue, chicucthue, tungay, denngay,
        ct22, ct23, ct24, ct25, ct26, ct27, ct28, ct29, ct30,
        ct31, ct32, ct33, ct34, ct35, ct36, ct37, ct38, ct39,
        ct40, ct41, ct42, ct43, ct44, ct45, ct46, ct47, ct48, ct49 } = req.body;
    const tokhaithue = await Tokhai.create();

}


module.exports = {
    create: createTokhai,
    
}