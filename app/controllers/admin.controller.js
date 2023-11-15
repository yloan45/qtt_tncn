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
const Phuluc = db.phuluc;

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

    if (tochuckekhaithue.length === 0) {
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
      },
      {
        model: Phuluc, as: 'phu_lucs'
      }
    ]
  });

  if (!tokhai) {
    res.json({ message: 'Không tìm thấy thông tin tờ khai phù hợp', isSuccess: false });
    return;
  }

  const { ct22, ct27, ct36 } = tokhai;

  let hasAttachment = false;
  if (ct27 > 0 || ct36 > 0) {
    if (tokhai.phu_lucs && tokhai.phu_lucs.length > 0) {
      hasAttachment = true;
    }
  }

  console.log('Has Attachment:', hasAttachment);
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

  let result = { message: '', isSuccess: false, hasAttachment: hasAttachment };

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

    if (ct22_number === tongthu && hasAttachment === true) {
      console.log('ct22 === tongthu:', ct22_number === tongthu);
      result = { message: 'Tờ khai hợp lệ', isSuccess: true, ct22: ct22_number, hasAttachment: hasAttachment };
    } else if (ct22_number === tongthu && hasAttachment === false) {
      console.log('ct22 === tongthu:', ct22_number === tongthu);
      result = { message: 'Tờ khai thiếu phụ lục kèm theo', isSuccess: false };
    } else {
      console.log('ct22 !== tongthu:', ct22_number === tongthu);
      result = { message: 'Tổng thu nhập chịu thuế không đúng', isSuccess: false };
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
        include: [{
          model: Canhan, as: 'ca_nhan'
        }]
      });

      if (!tokhai) {
        return res.status(404).json({ message: 'Tờ khai đã được duyệt' });
      }
      await tokhai.update({ trangThaiXuLiId: 2 });        // trạng thái "đã duyệt"
      const email = tokhai.ca_nhan.email;
      mailer.sendMail(email, "Tờ khai của bạn đã được duyệt",
        `Xin chào ${tokhai.fullname} <br>
        Tờ khai quyết toán thuế thu nhập cá nhân của bạn đã được duyệt, thông tin chi tiết như sau:
        <li>Tổng thu nhập chịu thuế của bạn là: ${tokhai.ct22}</li>
       <li> Số thuế phải nộp là: ${tokhai.ct44} đồng </li>
       <li> Só thuế đề nghị hoàn trả vào tài khoản là: ${tokhai.ct46} đồng </li><br>
       Bạn vui lòng đến cơ quan quản lý thuế tại ${tokhai.ca_nhan.cqqtthue} để hoàn tất thủ tục quyết toán thuế năm ${tokhai.namkekhai}`);
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
    if (checkTokhaiResult.isSuccess === false) {
      const tokhai = await Tokhaithue.findOne({
        where: {
          id: tokhaiId,
          trangThaiXuLiId: 1,                                           // trạng thái "đang chờ duyệt"
        },
        include: [{
          model: Canhan, as: 'ca_nhan'
        }]
      });

      if (!tokhai) {
        return res.status(404).json({ message: 'Tờ khai đã duyệt!' });
      }

      await tokhai.update({ trangThaiXuLiId: 3 });                        // trạng thái "không được duyệt"
      const email = tokhai.ca_nhan.email;

      if (checkTokhaiResult.message === "Tờ khai thiếu phụ lục kèm theo") {
        mailer.sendMail(email, `Tờ khai QTT-TNCN năm ${tokhai.namkekhai} không được duyệt`,
          `Xin chào ${tokhai.fullname}, <br>
        Tờ khai quyết toán thuế của bạn không được duyệt, lý do:
        <li>${checkTokhaiResult.message}</li>
        Vui lòng kiểm tra và bổ sung các loại giáy tờ/chứng từ liên quan vào phụ lục trong mục tra cứu tờ khai
        `);
      } else if (checkTokhaiResult.message === "Không tìm thấy mã số thuế phù hợp") {
        mailer.sendMail(email, "Tờ khai không được duyệt",
          `Xin chào ${tokhai.fullname}, <br>
        Tờ khai quyết toán thuế của bạn không được duyệt, lý do:
        <li>${checkTokhaiResult.message}</li>
        Vui lòng kiểm tra và đối chiếu lại thông tin của bạn tại nơi làm việc.
        `);
      } else if (checkTokhaiResult.message === "Tổng thu nhập chịu thuế không đúng") {
        mailer.sendMail(email, "Tờ khai không được duyệt",
          `Xin chào ${tokhai.fullname}, <br>
       Tờ khai quyết toán thuế của bạn không được duyệt, lý do:
       <li>${checkTokhaiResult.message}</li>
       Vui lòng kiểm tra và đối chiếu lại cá thông tin thu nhập của bạn tại nơi làm việc hoặc kiểm tra nhanh tại mục tra cứu thu nhập cá nhân.
       `);
      }
      await Duyettokhai.create({
        username: username,
        adminId: adminId,
        toKhaiThueId: tokhaiId
      });
      return res.status(200).json({ message: 'Duyệt tờ khai thành công!' });
    } else {
      return res.status(400).json({ message: `Tờ khai chưa được kiểm tra hoặc thông tin tờ khai là hợp lệ!` });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error' });
  }
}

module.exports = {
  duyettokhai, getTokhaithue, tokhaikhongduocduyet,
  checkTokhai, getListAllTongThuNhap, getListThuNhap
}