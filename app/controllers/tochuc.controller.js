const db = require("../models");
const mailer = require('../utils/mailer');
require('dotenv/config');
const User = db.user;
const Tochuc = db.tochuc;
const ExcelUpload = db.tochuckekhaithue;
const Diachi = db.diachi;
const Kyquyettoan = db.kyquyettoan;
const Op = db.Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt');

exports.registerTochucStep1 = async (req, res) => {
  try {
    const { masothue } = req.body;
    const userCaptcha = req.body.captcha;
    req.session.user = null;
    const user = await Tochuc.findOne({
      where: {
        masothue: masothue,
        status: "đã xác nhận"
      },
      include: [{
        model: Diachi,
        as: 'dia_chis'
      }]
    });

    req.session.user = user;

    if (!user) {
      console.log("không tìm thấy mst")
      req.flash('error', 'Không tìm thấy mã số thuế.');
      return res.render('tochuc/registerStep1');
    }
    console.log(`thông tin user có mst: ${masothue} là:`, user)

    if (userCaptcha !== req.session.captcha) {
      console.log("mã captcha không đúng");
      req.flash('error', 'Mã kiểm tra không đúng');
      return res.render('tochuc/registerStep1');
    }
    res.render('tochuc/registerStep2', { user });
  } catch (error) {
    console.log(error);
    throw error;
  }

};

exports.registerTochucStep2 = async (req, res) => {
  try {
    const { tentochuc, masothue, email,linhvuc, phone, tinh_tp, cqqtthue } = req.body;
    req.session.user = null;
    const user = {
      tentochuc: tentochuc,
      masothue: masothue,
      email: email,
      phone: phone,
      linhvuc: linhvuc,
      cqqtthue: cqqtthue,
      status: null
    };
    req.session.user = user;
    req.session.tinh_tp = { tinh_tp };
    console.log(user);
    res.render('tochuc/registerStep3', { tinh_tp, user });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.registerTochucStep3 = async (req, res) => {
  try {
    const user = req.session.user;
    const id = req.session.id;
    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 6);

    const tochuc = await Tochuc.findOne({ where: { masothue: user.masothue } });

    await Tochuc.update({ status: null }, {
      where: {
        masothue: user.masothue,
      },
    });

    const createdUser = await User.create({
      username: user.masothue,
      password: hashedPassword,
      toChucId: tochuc.id,
    });

    const result = createdUser.setRoles([2]);
    if (result) {
      mailer.sendMail(tochuc.email, "Tạo tài khoản thành công",
        `Xin chào ${tochuc.fullname} <br>
     Bạn đã đăng ký thành công tài khoản. Tài khoản:  <br>
      Tài khoản đăng nhập hệ thống của bạn:<br>
      - MST NTT: ${tochuc.masothue} <br>
      - Mật khẩu: ${randomPassword}`);
      return res.send(`<script>alert('Đăng ký tài khoản thành công!'); window.location.href = '/tochuc/login';</script>`);
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};




exports.getToChucTreHanData = async () => {
  try {
    const currentYear = new Date().getFullYear();

    const kyquyettoanForCurrentYear = await Kyquyettoan.findOne({
      where: {
        trangthai: true,
        ngaymotochuc: { [Op.gte]: `${currentYear}-01-01` },
        ngaydongtochuc: { [Op.lte]: `${currentYear}-12-31` },
      },
    });

    if (!kyquyettoanForCurrentYear) {
      console.error('Kỳ quyết toán không tồn tại.');
      return null;
    }

    const ngaymo = kyquyettoanForCurrentYear.ngaymotochuc;
    const ngaydong = kyquyettoanForCurrentYear.ngaydongtochuc;

    const tochucTreHan = await Tochuc.findAll({
      include: [
        {
          model: ExcelUpload,
          as: 'upload_excels',
          required: false,
          where: {
            toChucId: {
              [Op.eq]: db.sequelize.literal('`to_chuc`.`id`'), 
            },
            createdAt: {
              [Op.between]: [ngaymo, ngaydong],
            },
          },
        },
        {
          model: Diachi,
          as: 'dia_chis',
        },
      ],
    });

    console.log('tochucTreHan:', tochucTreHan);
    if (!tochucTreHan || !Array.isArray(tochucTreHan)) {
      console.error('Invalid or empty data returned.');
      return [];
    }

    const danhSachTreHan = [];

    tochucTreHan.forEach((tochuc) => {
      const uploadsInRange = tochuc.upload_excels.some((upload) => {
        const uploadDate = new Date(upload.createdAt);
        return uploadDate >= new Date(ngaymo) && uploadDate <= new Date(ngaydong);
      });
    
      if (uploadsInRange) {
        danhSachTreHan.push({
          tochuc,
          trangthai: 'Đúng hạn',
        });
      } else {
        danhSachTreHan.push({
          tochuc,
          trangthai: 'Trễ hạn',
        });
      }
    });
    
    console.log('danh sách tổ chức trễ hạn là:', danhSachTreHan);
    
    return danhSachTreHan;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

exports.renderToChucTreHanQTT = async (res, data) => {
  try {
    const danhSachTreHan = data.filter(item => item.trangthai === 'Trễ hạn');
    console.log("danh sách tổ chức trễ hạn là: ", data);
    res.render('admin/list_tochuc_tre_han', { result: danhSachTreHan, num: danhSachTreHan.length });
  } catch (error) {
    console.error('Error rendering view:', error);
    throw error;
  }
};

exports.sendEmailsToChuc = async (data) => {
  try {
    const overdueOrganizations = data.filter(item => item.trangthai === 'Trễ hạn');

    for (const organization of overdueOrganizations) {
      const email = organization.tochuc.email; 
      const subject = 'Thông báo: Qúa hạn quyết toán thuế';
      const text = `Xin chào ${organization.tochuc.tentochuc},\n\n Bạn đã quá hạn quyết toán thuế. Vui lòng đến cơ quan quản lý thuế để giải quyết thủ tục quá hạn quyết toán thuế.`;

      await mailer.sendMail(email, subject, text);
    }
  } catch (error) {
    console.error('Error sending emails:', error);
    throw error;
  }
};


exports.deleteNhanVien = (req, res) => {
  ExcelUpload.destroy({
    where: {
      id: req.params.id
    },
  })
    .then(function (rowDeleted) {
      if (rowDeleted == 1) {
        console.log("deleted!!!");
        res.redirect('/tochuc/upload');
      }
    })
}

exports.deleteToChuc = (req, res) => {
  Tochuc.destroy({
    where: {
      id: req.params.id
    },
    include: [User]
  })
    .then(function (rowDeleted) {
      if (rowDeleted == 1) {
        console.log("deleted!!!");
        res.redirect('/list-dn');
      }
    })
}

exports.getAllToChuc = (req, res) => {
  Tochuc.findAll({
    include: [{
      model: Diachi, as: 'dia_chis'
    }]
  }).then((users) => {
    res.render("admin/listdn",
      { user: users });
  })
    .catch((err) => console.log(err));
}


exports.findOneToChuc = (req, res) => {
  const id = req.params.id;
  Tochuc.findByPk(id).then((data) => {
    if (data) {
      res.render("admin/update.ejs", {
        data: data
      });
    } else {
      res.status(404).send({
        message: "Not found User with id " + id
      })
    }
  })
    .catch(err => {
      res.status(500).send({
        message: "error"
      });
    })
}

exports.updateToChuc = (req, res) => {
  const id = req.params.id;
  Tochuc.update(req.body, { where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.redirect("/list-user");
      } else {
        res.send('Unable to update the user');
      }
    })
}

exports.updateNhanvien = (req, res) => {
  const id = req.params.id;
  ExcelUpload.update(req.body, { where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.json("Cập nhật thành công")
      } else {
        res.send('Unable to update the user');
      }
    })
}

exports.deleteMultiple = async (req, res) => {
  const idsToDelete = req.body.ids;
  try {
    const result = await ExcelUpload.destroy({
      where: {
        id: { [Sequelize.Op.in]: idsToDelete },
      },
    });
    console.log('Received IDs:', idsToDelete);
    if (result) {
      res.json({ success: true, message: 'Deleted successfully' });
    } else {
      res.json({ success: false, message: 'No records deleted' });
    }
  } catch (error) {
    console.error('Error during deletion:', error);
    res.status(500).json({ success: false, message: 'Error during deletion' });
  }
}

exports.getTochuc = async (req, res) => {
  const userId = req.session.user.id;
  const user = await User.findByPk(userId, {
    include: {
      model: Tochuc,
      as: 'to_chuc',
      include: [{model: Diachi, as: 'dia_chis'}]
    }
  });
  if (user) {
    res.render('tochuc/index', {
      user: user
    });
  } else {
    res.status(404).json({ message: 'Người dùng không tồn tại' });
  }
}

exports.updateToChuc = async (req, res) => {
  const id = req.body.id;
  const user = await Tochuc.findByPk(id, {
    where: { id: id },
    include: [{ model: Diachi, as: 'dia_chis' }]
  });
  try {
    const [num] = await Tochuc.update(req.body, {
      where: { id: id },

    });

    const [address] = await Diachi.update(req.body, {where: {toChucId: user.id}});

    if (num > 0 ) {
      req.flash('success', 'Cập nhật thông tin thành công!');
      return res.send(`<script>alert('Cập nhật thông tin thành công!'); window.location.href = '/tochuc/cap-nhat-thong-tin';</script>`);
    } else {
      req.flash('error', 'Không thể cập nhật người dùng');
      return res.send(`<script>alert('Không thể cập nhật người dùng!'); window.location.href = '/tochuc/cap-nhat-thong-tin';</script>`);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    req.flash('error', 'Đã xảy ra lỗi khi cập nhật thông tin.');
    return res.send(`<script>alert('Đã xảy ra lỗi khi cập nhật thông tin!'); window.location.href = '/tochuc/cap-nhat-thong-tin';</script>`);
  }
};

const otpDatabase = new Map();

exports.forgotPasswordToChuc = async (req, res) => {

  const { masothue } = req.body;
  const userCaptcha = req.body.captcha;
  req.session.user = null;
  const user = await Tochuc.findOne({
    where: {
      masothue: masothue
    },
    include: [{
      model: Diachi,
      as: 'dia_chis'
    }]
  });

  req.session.user = user;

  if (!user) {
    console.log("không tìm thấy mst")
    req.flash('error', 'Không tìm thấy mã số thuế.');
    return res.render('tochuc/otp');
  }
  console.log(`thông tin user có mst: ${masothue} là:`, user)

  if (userCaptcha !== req.session.captcha) {
    console.log("mã captcha không đúng");
    req.flash('error', 'Mã kiểm tra không đúng');
    return res.render('tochuc/otp');
  }


  res.render('tochuc/forgotPassword', { user });
  const email = user.email;
  console.log(`email user có mst: ${masothue} là:`, email)
  const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
  const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes

  otpDatabase.set(email, { otp, expirationTime });
  try {

    await mailer.sendMail(user.email, "Xác nhận đổi mật khẩu", `
      Xin chào người dùng ${user.fullname},<br>
      Bạn vừa yêu cầu đổi mật khẩu, <br>
      Mã OTP của bạn là: ${otp}, <br>
      Vui lòng không cung cấp mã xác thực cho bất kỳ ai. Mã OTP có hiệu lực trong vòng 15 phút.
    `);
    console.log('Email sent successfully.');

  } catch (error) {
    console.error('Error sending email:', error);
    req.flash('error', 'Lỗi gửi email.');
    return res.redirect("/");
  }
};

function generateRandomPassword() {
  return crypto.randomBytes(4).toString('hex');
}

exports.forgotPasswordToChucStep2 = async (req, res) => {
  const { email, otp } = req.body;
  const randomPassword = generateRandomPassword();
  const storedData = otpDatabase.get(email);
  if (storedData && storedData.otp === otp && Date.now() < storedData.expirationTime) {
    try {
      const hashedPassword = await bcrypt.hash(randomPassword, 4);
      const tochuc = await Tochuc.findOne({
        where: { email: email },
      });

      if (!tochuc) {
        req.flash('error', 'Người dùng không tồn tại.');
        return res.redirect("/quen-mat-khau");
      }
      await User.update({ password: hashedPassword }, {
        where: { toChucId: tochuc.id }
      });
      otpDatabase.delete(email);

      req.flash('success', 'Mật khẩu đã được đặt lại thành công.');
      console.log("mật khẩu mới là: ", randomPassword);
      mailer.sendMail(email, "Đổi mật khẩu thành công", `Mật khẩu mới của bạn là: ${randomPassword}`)
      return res.redirect("/tochuc/login");
    } catch (error) {
      console.error('Error resetting password:', error);
      req.flash('error', 'Đã xảy ra lỗi khi đặt lại mật khẩu.');
      return res.redirect("/quen-mat-khau");
    }
  } else {
    req.flash('error', 'Mã OTP không đúng hoặc đã hết hạn.');
    return res.redirect("/quen-mat-khau");
  }
};
