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

const checkTokhai = async (req, res) => {
  const id = req.params.id;
  const { masothue, ct37 } = req.body;

  const tokhai = await Tokhaithue.findOne({
    where: {
      id: id,
      masothue: masothue
    }
  });
  const ct37_temp = ct37;         // update lại read từ tờ khai thuể về
  const ct37WithoutCommas = ct37_temp.replace(/,/g, ''); 
  
  const ct37_number = parseFloat(ct37WithoutCommas);
  console.log("Mã số thuế là", masothue);
  console.log("Số thuế đã được khấu trừ là",ct37_number);

  const tochuckekhaithue = await Tochuckekhaithue.findAll({
    where: {
      masothue: masothue
    }
  });

  if (tochuckekhaithue.length > 0) {
    let tong_khautruthue = 0;
    tochuckekhaithue.forEach((banGhi) => {
      const khautruthue = parseFloat(banGhi.tong_khautruthue);
      if (!isNaN(khautruthue)) {
        tong_khautruthue += khautruthue;
      }
    });
    console.log('Tổng khẩu trừ thuế:', tong_khautruthue);

    if (ct37_number == tong_khautruthue) {
      console.log('ct37 === tong_khautruthue:', ct37_number === tong_khautruthue);
      res.send('Hợp lệ');
    } else {
      console.log('ct37 === tong_khautruthue:', ct37_number === tong_khautruthue);
      res.send('Không hợp lệ');
    }
  } else {
    res.send('Không tìm thấy mã số thuế phù hợp');
  }
}


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
      return res.status(404).json({ message: 'Tờ khai đã duyệt!' });
    }
    await tokhai.update({ trangThaiXuLiId: 2 });        // trạng thái "đã duyệt"
    const email = tokhai.email;
    mailer.sendMail(email,"Tờ khai của bạn đã được duyệt");
    await Duyettokhai.create({
      username: username,
      adminId:  adminId,
      toKhaiThueId: tokhaiId,
      ngayDuyet: new Date(),
    });

    return res.status(200).json({ message: 'Duyệt tờ khai thành công!' });
  } catch (error) {
    return res.status(500).json({ error: 'Error' });
  }
}
const tokhaikhongduocduyet = async (req, res) => {
  try {
    const tokhaiId = req.params.id;
    const {username, adminId} = req.session.user;

    const tokhai = await Tokhaithue.findOne({
      where: {
        id: tokhaiId,
        trangThaiXuLiId: 1,                                           // trạng thái "đang chờ duyệt"
      },
    });


    if (!tokhai) {
      return res.status(404).json({ message: 'Tờ khai đã duyệt!' });
    }

    await tokhai.update({ trangThaiXuLiId: 3 });                        // trạng thái "không được duyệt"

    const {email, ct22, ct44, ct45, ct35, ct34} = tokhai;

    mailer.sendMail(email,"Tờ khai không được duyệt");


    await Duyettokhai.create({
      username: username,
      adminId:  adminId,
      toKhaiThueId: tokhaiId
    });

    return res.status(200).json({ message: 'Duyệt tờ khai thành công!' });
  } catch (error) {
    return res.status(500).json({ error: 'Error' });
  }
}

module.exports = {
  duyettokhai, getTokhaithue, tokhaikhongduocduyet, checkTokhai
}