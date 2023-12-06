const db = require("../models");
const config = require("../config/auth.config");
require('dotenv/config');
const mailer = require('../utils/mailer');
const Trangthaixuly = db.trangthaixuly;
const User = db.user;
const Op = db.Sequelize.Op;
const Canhan = db.canhan;
const Tokhaithue = db.tokhaithue;
const Tochuckekhaithue = db.tochuckekhaithue;
const Duyettokhai = db.duyettokhai;
const Tochuc = db.tochuc;
const Phuluc = db.phuluc;
const Files = db.file;
const path = require('path');
const archiver = require('archiver');
const fs = require('fs');
const { formatDate } = require("../middleware");
const Hoanthue = db.hoantrathue;
const Kyquyettoan = db.kyquyettoan;

/*
const moKyQuyetToan = async (req, res, ngaymo, ngaydong) => {
  try {
    const adminId = req.body.adminId;

    if (!adminId) {
      req.flash('error', 'Admin không tồn tại!');
      return res.redirect('/admin');
    }

    const currentYear = new Date().getFullYear();

    const kyQuyetToanCount = await Kyquyettoan.count({
      where: {
        trangthai: true,
        adminId: adminId,
        ngaymo: {
          [Op.between]: [new Date(`${currentYear}-01-01`), new Date(`${currentYear}-12-31`)],
        },
      },
    });

    if (kyQuyetToanCount >= 1) {
      req.flash('error', 'Chỉ được mở QTT-TCCN 1 lần trong năm');
      return res.redirect('/admin');
    }

    const kyQuyetToan = await Kyquyettoan.create({
      trangthai: true,
      ngaymo: ngaymo.toISOString(),
      ngaydong: ngaydong.toISOString(),
      adminId: adminId,
    });

    req.flash('success', 'Kỳ đăng ký đã được mở thành công!');
    return res.redirect('/admin');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Lỗi khi tạo Kỳ Đăng Ký');
    return res.redirect('/admin');
  }
};
*/

const listOpenKyQuyetToan = async (req, res) => {
  try {
    const adminId = req.session.user;
    console.log("admin id là:", adminId);
    const listOpen = await Kyquyettoan.findAll();
    if (listOpen) {
      res.render('admin/kyquyettoan', { listOpen: listOpen, admin: adminId });
    }
  } catch (error) {
    console.log(error);
    req.redirect('/admin');
  }

};

const moKyQuyetToan = async (req, res) => {
  try {
    const adminId = req.body.adminId;
    const { ngaymo, ngaydong } = req.body;
    if (!adminId) {
      req.flash('error', 'Admin không tồn tại!');
      return res.redirect('/admin');
    }
    const currentYear = new Date().getFullYear();
    const kyQuyetToanCount = await Kyquyettoan.count({
      where: {
        trangthai: true,
        adminId: adminId,
        ngaymo: {
          [Op.between]: [new Date(`${currentYear}-01-01`), new Date(`${currentYear}-12-31`)],
        },
      },
    });

    /*
    if (kyQuyetToanCount >= 1) {
      req.flash('error', 'Chỉ được mở QTT-TCCN 1 lần trong năm');
      return res.redirect('/admin');
    }
    */

    const kyQuyetToan = await Kyquyettoan.create({
      trangthai: true,
      ngaymo: ngaymo,
      ngaydong: ngaydong,
      adminId: adminId,
    });

    req.flash('success', 'Kỳ đăng ký đã được mở thành công!');

    /*
      const currentDate = new Date();
      if (currentDate > ngaydong) {
        await Kyquyettoan.update({ trangthai: false }, { where: { id: kyQuyetToan.id } });
        req.flash('info', 'Kỳ quyết toán đã đóng.');
      } */

    return res.redirect('/ky-quyet-toan');


  } catch (error) {
    console.error(error);
    req.flash('error', 'Lỗi khi tạo Kỳ Đăng Ký');
    return res.redirect('/ky-quyet-toan');
  }
};

const moKyQuyetToanTochuc = async (req, res) => {
  try {
    const adminId = req.body.adminId;
    const { ngaymo, ngaydong, openTochuc, closeTochuc } = req.body;

    console.log(req.body);
    if (!adminId) {
      console.log("admin không tồn tại");
      req.flash('error', 'Admin không tồn tại!');
      return res.redirect('/admin');
    }

    if ((new Date(ngaymo) <= new Date(closeTochuc)) || (new Date(ngaydong) < new Date(ngaymo)) || (new Date(closeTochuc) < new Date(openTochuc))) {
      return res.redirect('/ky-quyet-toan?=failed');
    }

    const kyQuyetToanTochuc = await Kyquyettoan.create({
      trangthai: true,
      ngaymo: ngaymo,
      ngaydong: ngaydong,
      ngaymotochuc: openTochuc,
      ngaydongtochuc: closeTochuc,
      adminId: adminId,
    });

    req.flash('success', 'Kỳ đăng ký đã được mở thành công!');
    return res.redirect('/ky-quyet-toan?=success');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Lỗi khi tạo Kỳ Đăng Ký');
    return res.redirect('/admin');
  }
};

const findOneQTT = async (req, res) => {
  const id = req.params.id;
  const admin = req.session.user;
  console.log("id là: ", admin);
  const kyquyettoan = await Kyquyettoan.findByPk(id);
  if (!kyquyettoan) {
    req.flash('error', "Không tìm thấy dữ liệu.");
    return res.redirect('/admin');
  }
  console.log("thông tin kỳ quyết toán là:" + kyquyettoan);
  return res.render('admin/edit_QTT', { kyquyettoan, admin });
};

const updateQTT = async (req, res) => {
  const id = req.params.id;
  const { openCN, closeCN, openTC, closeTC } = req.body;
  try {
    const updateResult = await Kyquyettoan.update(
      {
        ngaymo: openCN,
        ngaydong: closeCN,
        ngaymotochuc: openTC,
        ngaydongtochuc: closeTC
      },
      {
        where: { id: id }
      }
    );
    if (updateResult[0] > 0) {
      console.log('Update successful');
      res.redirect('/ky-quyet-toan?=update-success');
    } else {
      console.log('No records were updated');
      res.redirect('/admin?=false');
    }
  } catch (error) {
    console.error('Error updating record:', error);
    res.redirect('/admin?=error');
  }
};

module.exports = { updateQTT };

const deleteQTT = (req, res) => {
  Kyquyettoan.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(function (rowDeleted) {
      if (rowDeleted == 1) {
        console.log("deleted!!!");
        res.redirect('/ky-quyet-toan');
      }
    })
};

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
      },
      {
        model: Hoanthue, as: 'hoan_tra_thue'
      }
    ]
  });

  if (!tokhai) {
    res.json({ message: 'Không tìm thấy thông tin tờ khai phù hợp', isSuccess: false });
    return;
  }

  const { ct22, ct27, ct36, stk, nganhang } = tokhai;
  let hasAttachment = tokhai.phu_lucs && tokhai.phu_lucs.length > 0;

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
    },
    include: [{ model: Tochuc, as: 'to_chuc' }]
  });

  console.log("Danh sách các tổ chức: ", tochuckekhaithue);


  let validationResult;
  if (tokhai.ct46 <= tokhai.ct44 && tokhai.hoan_tra_thue.tonghoantra === tokhai.ct46) {
    validationResult = {
      isValid: true,
      message: '',
    }
  } else {
    validationResult = {
      isValid: false,
      message: 'Đề nghị hoàn trả thuế không chính xác!',
    }
  }

  let result = { message: '', isSuccess: false, hasAttachment: hasAttachment, validationResult };




  if (tochuckekhaithue.length > 0) {
    let tongthu = 0;

    // Tính tổng khấu trừ thuế
    const organizationsInfo = [];
    tochuckekhaithue.forEach((banGhi) => {
      const khautruthue = parseFloat(banGhi.thunhaptinhthue);
      if (!isNaN(khautruthue)) {
        tongthu += khautruthue;
        const organizationInfo = {
          organizationName: banGhi.to_chuc.tentochuc,
        };
        console.log('Organization Name:', organizationInfo.organizationName);

        // Push organizationInfo to the array
        organizationsInfo.push(organizationInfo);
        result.organizationsInfo = organizationsInfo;
      }
    });

    console.log('Tổng khẩu trừ thuế:', tongthu);
    /*
        if(tokhai.stk && tokhai.nganhang && tokhai.hoan_tra_thue.tonghoantra == 0){
          console.log('ct22 === tongthu:', ct22_number === tongthu);
          result = { message: 'Tờ khai hợp lệ.', isSuccess: true, ct22: ct22_number, hasAttachment: hasAttachment, validationResult };
        } else {
          console.log('ct22 === tongthu:', ct22_number === tongthu);
          result = { message: 'Tờ khai còn thiếu thông tin tài khoản ngân hàng.<br>', isSuccess: true, ct22: ct22_number, hasAttachment: hasAttachment, validationResult };
        }
    */

    if (ct22_number === tongthu && hasAttachment === true) {
      console.log('ct22 === tongthu:', ct22_number === tongthu);
      result = { message: 'Tờ khai hợp lệ.', isSuccess: true, ct22: ct22_number, hasAttachment: hasAttachment };

    } else if (ct22_number === tongthu && hasAttachment === false) {
      console.log('ct22 === tongthu:', ct22_number === tongthu);
      result = { message: 'Tờ khai thiếu phụ lục kèm theo', isSuccess: false };
    } else {
      console.log('ct22 !== tongthu:', ct22_number === tongthu);
      result = {
        message: `Tổng thu nhập chịu thuế không đúng.
      <br>Tổng thu nhập chịu thuế là: ${tongthu} vnđ
      <br>Thu nhập từ các tổ chức: ${result.organizationsInfo.map(org => org.organizationName).join(', ')}</li>`, isSuccess: false
      };
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
    if (checkTokhaiResult.isSuccess == true) {
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
      if (checkTokhaiResult.message) {
        mailer.sendMail(email, "Tờ khai của bạn đã được duyệt",
          `Xin chào ${tokhai.fullname} <br>
        Tờ khai quyết toán thuế thu nhập cá nhân của bạn đã được duyệt, thông tin chi tiết như sau:
        <li>Tổng thu nhập chịu thuế của bạn là: ${tokhai.ct22}</li>
       <li> Số thuế phải nộp là: ${tokhai.ct44} đồng </li>
       <li> Só thuế đề nghị hoàn trả vào tài khoản là: ${tokhai.ct46} đồng </li><br>
        Vui lòng đến cơ quan quản lý thuế tại ${tokhai.ca_nhan.cqqtthue} để hoàn tất thủ tục quyết toán thuế năm ${tokhai.namkekhai}`);
      }
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

let checkTokhaiResult = {};

const tokhaikhongduocduyet = async (req, res) => {
  try {
    const tokhaiId = req.params.id;
    const { username, adminId } = req.session.user;
    if (checkTokhaiResult.isSuccess  === false) {
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

      if (checkTokhaiResult.message) {
        mailer.sendMail(email, `Tờ khai QTT-TNCN năm ${tokhai.namkekhai} không được duyệt`,
          `Xin chào ${tokhai.fullname}, <br>
        Tờ khai quyết toán thuế của bạn không được duyệt, lý do:
        <br>${checkTokhaiResult.message}
        <br>Vui lòng kiểm tra lại thông tin và cập nhật chính xác.
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

/*
const tokhaikhongduocduyet = async (req, res) => {
  try {
    const tokhaiId = req.params.id;
    const { username, adminId } = req.session.user;
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

    const email = tokhai.ca_nhan.email;

    if (checkTokhaiResult.isSuccess) {
      if (checkTokhaiResult.isSuccess === true) {
        await tokhai.update({ trangThaiXuLiId: 3 });
        if (checkTokhaiResult.message) {
          mailer.sendMail(email, `Tờ khai QTT-TNCN năm ${tokhai.namkekhai} không được duyệt`,
            `Xin chào ${tokhai.fullname}, <br>
          Thông tin kê khai tờ khai QTT-TNCN của bạn là hợp lệ, nhưng thông tin phụ lục kèm theo là không đúng.
          <br>Vui lòng kiểm tra lại thông tin và cập nhật chính xác.
          `);
        }
        await Duyettokhai.create({
          username: username,
          adminId: adminId,
          toKhaiThueId: tokhaiId
        });
        return res.status(200).json({ message: 'Duyệt tờ khai thành công!' });
      }
      else {
        await tokhai.update({ trangThaiXuLiId: 3 });                        // trạng thái "không được duyệt
        if (checkTokhaiResult.message) {
          mailer.sendMail(email, `Tờ khai QTT-TNCN năm ${tokhai.namkekhai} không được duyệt`,
            `Xin chào ${tokhai.fullname}, <br>
        Tờ khai quyết toán thuế của bạn không được duyệt, lý do:
        <br>${checkTokhaiResult.message}
        <br>Vui lòng kiểm tra lại thông tin và cập nhật chính xác.
        `);
        }
        await Duyettokhai.create({
          username: username,
          adminId: adminId,
          toKhaiThueId: tokhaiId
        });
        return res.status(200).json({ message: 'Duyệt tờ khai thành công!' });
      }
    } else {
      return res.status(400).json({ message: `Tờ khai chưa được kiểm tra hoặc thông tin tờ khai là hợp lệ!` });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error' });
  }
}
*/
const getPhuluc = async (req, res) => {
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
        model: Phuluc,
        as: 'phu_lucs',
        include: [
          {
            model: Files,
            as: 'files',
          }
        ]
      }
    ]
  });
  if (!tokhai) {
    res.json({ message: 'Không tìm thấy tờ khai!' });
    return;
  }

  const listFiles = tokhai.phu_lucs.reduce((acc, phuluc) => {
    acc.push(...phuluc.files);
    return acc;
  }, []);

  console.log("phụ lục của tờ khai là: ", listFiles);
  res.render('admin/phuluc', {
    phuluc: listFiles,
    user: tokhai
  });


};

const downloadPhuluc = async (req, res) => {
  const tokhaiId = req.params.id;
  const tokhai = await Tokhaithue.findOne({
    where: {
      id: tokhaiId,
    },
    include: [
      {
        model: Phuluc,
        as: 'phu_lucs',
        include: [
          {
            model: Files,
            as: 'files',
          },
        ],
      },
    ],
  });

  if (!tokhai) {
    res.json({ message: 'Không tìm thấy tờ khai!' });
    return;
  }

  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  const zipFileName = `downloaded_files_${tokhaiId}.zip`;
  res.attachment(zipFileName);
  archive.pipe(res);
  const basePath = process.cwd();
  tokhai.phu_lucs.forEach((phuluc) => {
    phuluc.files.forEach((file) => {
      const filePath = path.join(basePath, 'public', 'uploads', file.filename);
      archive.file(filePath, { name: file.filename });
    });
  });
  archive.finalize();
};

module.exports = {
  duyettokhai, getTokhaithue, tokhaikhongduocduyet,
  checkTokhai, getListAllTongThuNhap, getListThuNhap, getPhuluc, downloadPhuluc,
  moKyQuyetToan, moKyQuyetToanTochuc, listOpenKyQuyetToan, deleteQTT,
  findOneQTT, updateQTT
}