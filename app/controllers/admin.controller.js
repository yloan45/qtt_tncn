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
const Tochuc = db.tochuc;


const getTokhaithue = async (req, res) => {
  const id = req.params.id;
  const tokhaithue = await Tokhaithue.findByPk(id);
  if (tokhaithue) {
    const canhan = await Canhan.findByPk(tokhaithue.caNhanId);
    res.json({ tokhaithue, canhan });
  } else {
    res.json(null);
  }
};

const getListAllTongThuNhap = async (req, res) => {
  const id = req.params.id;
  const { username, password, ct37 } = req.body;

  // Tìm user theo username và password
  const user = await User.findOne({
    where: {
      username: username,
      password: password
    },
    include: [{
      model: Canhan,
      attributes: ['masothue'] // Chọn các trường cần lấy từ Canhan
    }]
  });

  if (!user) {
    res.send('Không tìm thấy người dùng phù hợp');
    return;
  }

  const masothue = user.Canhan.masothue;

  const ct37_temp = ct37;         // update lại read từ tờ khai thuể về
  const ct37WithoutCommas = ct37_temp.replace(/,/g, '');

  const ct37_number = parseFloat(ct37WithoutCommas);
  console.log("Mã số thuế là", masothue);
  console.log("Số thuế đã được khấu trừ là", ct37_number);

  // Lấy danh sách thông tin khấu trừ thuế trước khi tính tổng
  const tochuckekhaithue = await Tochuckekhaithue.findAll({
    where: {
      masothue: masothue
    }
  });

  if (tochuckekhaithue.length > 0) {
    let tong_khautruthue = 0;

    // Tính tổng khấu trừ thuế
    tochuckekhaithue.forEach((banGhi) => {
      const khautruthue = parseFloat(banGhi.tong_khautruthue);
      if (!isNaN(khautruthue)) {
        tong_khautruthue += khautruthue;
      }
    });

    console.log('Tổng khẩu trừ thuế:', tong_khautruthue);

    if (ct37_number === tong_khautruthue) {
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

// còn update
const getListThuNhap = async (req, res) => {
  const id = req.session.user.caNhanId;
  const canhan = await Canhan.findByPk(id);
  const masothue = req.body.masothue;

  if (canhan && canhan.masothue === masothue) {
    const tochuckekhaithue = await Tochuckekhaithue.findAll({
      where: {
        masothue: masothue
      },
      include: [
        {
          model: Tochuc, as: 'to_chuc'
        }
      ]
    });
    
    if(tochuckekhaithue.length === 0){
      return null;
    }
    console.log(tochuckekhaithue);
    return tochuckekhaithue;
  }
};

let checkTokhaiResult = {};

const checkTokhai = async (req, res) => {
  const id = req.params.id;
  const tokhai = await Tokhaithue.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Canhan,
        as: 'ca_nhan'
      }
    ]
  });

  if (!tokhai) {
    res.json({ message: 'Không tìm thấy thông tin tờ khai phù hợp', isSuccess: false });
    return;
  }

  const { ct22 } = tokhai;
  const { masothue } = tokhai.ca_nhan;
  const ct22_temp = ct22; // Lấy ct22 từ đối tượng tokhai
  const ct22WithoutCommas = ct22_temp.replace(/,/g, '');

  const ct22_number = parseFloat(ct22WithoutCommas);
  console.log("Mã số thuế là", masothue);
  console.log("Số thuế đã được khấu trừ là", ct22_number);

  const tochuckekhaithue = await Tochuckekhaithue.findAll({
    where: {
      masothue: masothue
    }
  });

  console.log("Danh sách các tổ chức: ", tochuckekhaithue);

  let result = { message: '', isSuccess: false };

  if (tochuckekhaithue.length > 0) {
    let tongthu = 0;

    // Tính tổng khấu trừ thuế
    tochuckekhaithue.forEach((banGhi) => {
      const khautruthue = parseFloat(banGhi.thunhaptinhthue);
      if (!isNaN(khautruthue)) {
        tongthu += khautruthue;
      }
    });

    console.log('Tổng khẩu trừ thuế:', tongthu);

    if (ct22_number === tongthu) {
      console.log('ct22 === tongthu:', ct22_number === tongthu);
      result = { message: 'Hợp lệ', isSuccess: true, ct22: ct22_number };
    } else {
      console.log('ct22 === tongthu:', ct22_number === tongthu);
      result = { message: 'Không hợp lệ', isSuccess: false };
    }
  } else {
    result = { message: 'Không tìm thấy mã số thuế phù hợp', isSuccess: false };
  }

  checkTokhaiResult = result;
  console.log(result);
  res.json(result);

}

const duyettokhai = async (req, res) => {
  try {
    const tokhaiId = req.params.id;
    const { username, adminId } = req.session.user;
    if (checkTokhaiResult.isSuccess) {
      const tokhai = await Tokhaithue.findOne({
        where: {
          id: tokhaiId,
          trangThaiXuLiId: 1,                             // trạng thái "đang chờ duyệt"
        },
      });

      if (!tokhai) {
        return res.status(404).json({ message: 'Tờ khai đã được duyệt' });
      }
      await tokhai.update({ trangThaiXuLiId: 2 });        // trạng thái "đã duyệt"
      const email = tokhai.email;
      mailer.sendMail(email, "Tờ khai của bạn đã được duyệt",
        `Xin chào người dùng<br>`);
      await Duyettokhai.create({
        username: username,
        adminId: adminId,
        toKhaiThueId: tokhaiId,
        ngayDuyet: new Date(),
      });
      return res.status(200).json({ message: `${username} bạn đã duyệt tờ khai thành công!` });
    } else {
      return res.status(400).json({ message: `Tờ khai chưa được kiểm tra hoặc thông tin không chính xác!` });
    }
  }
  catch (error) {
    return res.status(500).json({ error: 'Error' });
  }
}

const tokhaikhongduocduyet = async (req, res) => {
  try {
    const tokhaiId = req.params.id;
    const { username, adminId } = req.session.user;

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

    const { email, ct22, ct44, ct45, ct35, ct34 } = tokhai;

    mailer.sendMail(email, "Tờ khai không được duyệt");


    await Duyettokhai.create({
      username: username,
      adminId: adminId,
      toKhaiThueId: tokhaiId
    });

    return res.status(200).json({ message: 'Duyệt tờ khai thành công!' });
  } catch (error) {
    return res.status(500).json({ error: 'Error' });
  }
}

module.exports = {
  duyettokhai, getTokhaithue, tokhaikhongduocduyet,
  checkTokhai, getListAllTongThuNhap, getListThuNhap
}