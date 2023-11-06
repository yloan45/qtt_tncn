const db = require("../models");
const config = require("../config/auth.config");
require('dotenv/config');
const mailer = require('../utils/mailer');
const { isAdmin } = require("../middleware/authJwt");
const Trangthaixuly = db.trangthaixuly;
const User = db.user;
const Op = db.Sequelize.Op;
const Canhan = db.canhan;
const Diachi = db.diachi;
const Tokhaithue = db.tokhaithue;
const Tochuckekhaithue = db.tochuckekhaithue;
const Trangthaitokhai = db.trangthaixuly;
const Duyettokhai = db.duyettokhai;
const Admin = db.admin;
const getTokhaithue = async (req, res) => {
    const id = req.params.id;
    const tokhaithue = await Tokhaithue.findByPk(id);
    if(tokhaithue){
      const canhan = await Canhan.findByPk(tokhaithue.caNhanId);
      res.json({tokhaithue, canhan});
    } else {
      res.json(null);
    }
};

 const duyettokhai = async (req, res) => {
  try {
    const tokhaiId = req.params.id;
    const {username, adminId} = req.session.user;
    const tokhai = await Tokhaithue.findOne({
      where: {
        id: tokhaiId,
        trangThaiXuLiId: 1,                             // trạng thái "đang chờ duyệt"
      },
    });
    console.log(adminId)
    if (!tokhai) {
      return res.status(404).json({ message: 'Không tìm thấy tờ khai để cập nhật.' });
    }
    await tokhai.update({ trangThaiXuLiId: 2 });        // trạng thái "đã duyệt"
    const email = tokhai.email;
    mailer.sendMail(email,"tờ khai đã được duyệt");
    await Duyettokhai.create({
      username: username,
      adminId:  adminId,
      toKhaiThueId: tokhaiId,
      ngayDuyet: new Date(),
    });

    return res.status(200).json({ message: 'Cập nhật trạng thái tờ khai thành công.' });
  } catch (error) {
    return res.status(500).json({ error: 'Lỗi xử lý yêu cầu' });
  }
}


const tokhaikhongduocduyet = async (req, res) => {
  try {
    const tokhaiId = req.params.id;
    const {username, adminId} = req.session.user;
    const tokhai = await Tokhaithue.findOne({
      where: {
        id: tokhaiId,
        trangThaiXuLiId: 1,                             // trạng thái "đang chờ duyệt"
      },
    });
    console.log(adminId)
    if (!tokhai) {
      return res.status(404).json({ message: 'Không tìm thấy tờ khai để cập nhật.' });
    }
    await tokhai.update({ trangThaiXuLiId: 3 });        // trạng thái "không được duyệt"
    const email = tokhai.email;
    mailer.sendMail(email,"tờ khai không được duyệt");
    await Duyettokhai.create({
      username: username,
      adminId:  adminId,
      toKhaiThueId: tokhaiId
    });

    return res.status(200).json({ message: 'Cập nhật trạng thái tờ khai thành công.' });
  } catch (error) {
    return res.status(500).json({ error: 'Lỗi xử lý yêu cầu' });
  }
}

module.exports = {
  duyettokhai, getTokhaithue, tokhaikhongduocduyet
}