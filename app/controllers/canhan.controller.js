
const db = require("../models");
require('dotenv/config');
const User = db.user;
const Canhan = db.canhan;
const Diachi = db.diachi;
const Tokhaithue = db.tokhaithue;
const Loaitokhai = db.loaitokhai;
const Kyquyettoan = db.kyquyettoan;
const bcrypt = require('bcrypt');
const mailer = require('../utils/mailer');
const Role = db.role;
const Op = db.Sequelize.Op;
const Bank = db.bank;
const crypto = require('crypto');
const { paginate, paginateCanhan } = require("../middleware");

exports.deleteUser = (req, res) => {
  Canhan.destroy({
    where: {
      id: req.params.id
    },
    include: [User]
  })
    .then(function (rowDeleted) {
      if (rowDeleted == 1) {
        console.log("deleted!!!");
        res.redirect('/list-user');
      }
    })
}

/*
exports.getAllUser = async (req, res) => {
  
 const canhan = await Canhan.findAll({
    where: {
      status: null,
    },
    include: [
      {
        model: Diachi, as: 'dia_chi' // Sử dụng alias đúng ở đây
      },
      {
        model: User, as: 'user'
      }
    ]
  }).then((users) => {
   // users = paginateCanhan(Canhan, {}, req.query.page || 1, 1);
    console.log(users);
    res.render("admin/listUser", {
      user: users,
    });
  })
    .catch((err) => console.log(err));
}
*/

exports.getAllUser = async (req, res) => {
  try {
    const canhan = await paginate(
      Canhan,
      { status: null },                         // status = null => người dùng đã được xác nhận
      req.query.page || 1, 25,
      [
        { model: Diachi, as: 'dia_chi' },
        { model: User, as: 'user' },
      ]);
    res.render("admin/listUser", { canhan });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getAllTokhaithue = (req, res) => {
  Tokhaithue.findAll({
    include: [
      {
        model: Loaitokhai, as: 'loai_to_khai' // Sử dụng alias đúng ở đây
      }
    ]
  }).then((tokhai) => {
    console.log(tokhai);
    res.render("admin/demo-list", {
      tokhai: tokhai,
    });
  })
    .catch((err) => console.log(err));
}

exports.findOne = (req, res) => {
  const id = req.params.id;
  Canhan.findByPk(id).then((data) => {
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

exports.findUser = (req, res) => {
  const id = req.params.id;
  Canhan.findByPk(id).then((data) => {
    if (data) {
      res.render("tokhai.ejs", {
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

exports.update = (req, res) => {
  const id = req.params.id;
  Canhan.update(req.body, { where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.redirect("/list-user");
      } else {
        res.send('Unable to update the user');
      }
    })
}

exports.updateCanhan = async (req, res) => {
  const id = req.params.id;
  const user = await Canhan.findByPk(id, {
    where: { id: id },
    include: [{ model: Diachi, as: 'dia_chi' }]
  });
  try {
    const [num] = await Canhan.update(req.body, {
      where: { id: id },

    });

    const [address] = await Diachi.update(req.body, {
      where: {
        id: user.dia_chi.id
      }
    })

    if (num > 0 && address > 0) {
      req.flash('success', 'Cập nhật thông tin thành công!');
      return res.redirect('/canhan');
    } else {
      req.flash('error', 'Không thể cập nhật người dùng');
      return res.redirect('/edit-profile?=false');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    req.flash('error', 'Đã xảy ra lỗi khi cập nhật thông tin.');
    return res.redirect('/edit-profile?=error');
  }
};

exports.changePassword = async (req, res) => {
  const id = req.body.id;
  const user = await User.findByPk(id);
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!user || !oldPassword || !bcrypt.compareSync(oldPassword, user.password)) {
    req.flash('oldPasswordError', 'Mật khẩu không đúng');
    return res.redirect('/change-password');
  }
  console.log('Provided Old Password:', oldPassword);
  console.log('Stored Hashed Password:', user.password);
  console.log('Provided new Password:', newPassword);
  console.log('Provided confirm  Password:', confirmPassword);
  if (
    newPassword.length < 6 ||
    !/[A-Z]/.test(newPassword) ||
    !/[!@#$%^&*()-=_+]/.test(newPassword)
  ) {
    req.flash(
      'newPasswordError',
      'Mật khẩu không đúng định dạng. Mật khẩu phải có ít nhất 6 ký tự, 1 ký tự in hoa và 1 ký tự đặt biệt'
    );
    return res.redirect('/change-password');
  }

  if (!(confirmPassword === newPassword)) {
    req.flash('confirmPasswordError', 'Xác nhận mật khẩu không trùng khớp');
    return res.redirect('/change-password');
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 8);
  await User.update({ password: hashedPassword }, { where: { id: id } });

  req.session.token = null;
  req.session.user = null;
  return res.redirect("/")
};

const otpDatabase = new Map();

exports.forgotPassword = async (req, res) => {

  const { masothue } = req.body;
  const userCaptcha = req.body.captcha;
  req.session.user = null;
  const user = await Canhan.findOne({
    where: {
      masothue: masothue
    },
    include: [{
      model: Diachi,
      as: 'dia_chi'
    }]
  });

  req.session.user = user;

  if (!user) {
    console.log("không tìm thấy mst")
    req.flash('error', 'Không tìm thấy mã số thuế.');
    return res.render('nguoidung/otp');
  }
  console.log(`thông tin user có mst: ${masothue} là:`, user)

  if (userCaptcha !== req.session.captcha) {
    console.log("mã captcha không đúng");
    req.flash('error', 'Mã kiểm tra không đúng');
    return res.render('nguoidung/otp');
  }


  res.render('nguoidung/forgot_password_step2', { user });
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

exports.registerStep1 = async (req, res) => {
  try {
    const { masothue } = req.body;
    const userCaptcha = req.body.captcha;
    req.session.user = null;
    const user = await Canhan.findOne({
      where: {
        masothue: masothue,
        status: "đã xác nhận"
      },
      include: [{
        model: Diachi,
        as: 'dia_chi'
      }]
    });

    req.session.user = user;

    if (!user) {
      console.log("không tìm thấy mst")
      req.flash('error', 'Không tìm thấy mã số thuế.');
      return res.render('nguoidung/registerStep1');
    }
    console.log(`thông tin user có mst: ${masothue} là:`, user)

    if (userCaptcha !== req.session.captcha) {
      console.log("mã captcha không đúng");
      req.flash('error', 'Mã kiểm tra không đúng');
      return res.render('nguoidung/registerStep1');
    }
    res.render('nguoidung/registerStep2', { user });
  } catch (error) {
    console.log(error);
    throw error;
  }

};

exports.registerStep2 = async (req, res) => {
  try {
    const { fullname, masothue, email, phone, tinh_tp, cccd, cqqtthue } = req.body;
    req.session.user = null;
    const user = {
      fullname: fullname,
      masothue: masothue,
      email: email,
      phone: phone,
      cccd: cccd,
      cqqtthue: cqqtthue,
      status: null
    };
    req.session.user = user;
    req.session.tinh_tp = { tinh_tp };
    console.log(user);
    res.render('nguoidung/registerStep3', { tinh_tp, user });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.registerStep3 = async (req, res) => {
  try {
    const user = req.session.user;
    const id = req.session.id;
    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 6);

    const canhan = await Canhan.findOne({ where: { masothue: user.masothue } });

    await Canhan.update({ status: null }, {
      where: {
        masothue: user.masothue,
      },
    });

    const createdUser = await User.create({
      username: user.masothue,
      password: hashedPassword,
      caNhanId: canhan.id,
    });

    const result = createdUser.setRoles([1]);
    if (result) {
      mailer.sendMail(canhan.email, "Tạo tài khoản thành công",
        `Xin chào ${canhan.fullname} <br>
     Bạn đã đăng ký thành công tài khoản. Tài khoản:  <br>
      Tài khoản đăng nhập hệ thống của bạn:<br>
      - MST NTT: ${canhan.masothue} <br>
      - Mật khẩu: ${randomPassword}`);
      //return res.redirect('/canhan/login');
    }


  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


function generateRandomPassword() {
  return crypto.randomBytes(4).toString('hex');
}

exports.forgotPasswordStep2 = async (req, res) => {
  const { email, otp } = req.body;
  const randomPassword = generateRandomPassword();
  const storedData = otpDatabase.get(email);
  if (storedData && storedData.otp === otp && Date.now() < storedData.expirationTime) {
    try {
      const hashedPassword = await bcrypt.hash(randomPassword, 4);
      const canhan = await Canhan.findOne({
        where: { email: email },
      });

      if (!canhan) {
        req.flash('error', 'Người dùng không tồn tại.');
        return res.redirect("/otp");
      }
      await User.update({ password: hashedPassword }, {
        where: { caNhanId: canhan.id }
      });
      otpDatabase.delete(email);

      req.flash('success', 'Mật khẩu đã được đặt lại thành công.');
      console.log("mật khẩu mới là: ", randomPassword);
      mailer.sendMail(email, "Đổi mật khẩu thành công", `Mật khẩu mới của bạn là: ${randomPassword}`)
      return res.redirect("/canhan/login");
    } catch (error) {
      console.error('Error resetting password:', error);
      req.flash('error', 'Đã xảy ra lỗi khi đặt lại mật khẩu.');
      return res.redirect("/otp");
    }
  } else {
    req.flash('error', 'Mã OTP không đúng hoặc đã hết hạn.');
    return res.redirect("/otp");
  }
};

exports.getUser = async (req, res) => {
  const userId = req.session.user.id;
  const user = await User.findByPk(userId, {
    include: {
      model: Canhan,
      as: 'ca_nhan',
      include: {
        model: Diachi,
        as: 'dia_chi'
      }
    }
  });

  const bank = await Bank.findAll();
  if (user) {
    res.render('nguoidung/tokhaithue', {
      user: user,
      bank
    });
  } else {
    res.status(404).json({ message: 'Người dùng không tồn tại' });
  }
}

exports.findPhuluc = async (req, res) => {
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
        model: db.phuluc,
        as: 'phu_lucs',
        include: [
          {
            model: db.file,
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

  const phuluc = tokhai.phu_lucs.reduce((acc, phuluc) => {
    acc.push(...phuluc.files);
    return acc;
  }, []);


  return res.render("nguoidung/listPhuLuc", {
    phuluc,
    tokhai
  });


};

exports.deleteFile = async (req, res) => {
  try {
    const phulucId = req.params.phulucId;
    const fileId = req.params.id;
    await db.file.destroy({ where: { id: fileId } });
    return res.redirect('back');
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ message: 'Đã có lỗi xảy ra khi xóa file!' });
  }
};


/*
exports.renderCanhanWithoutTokhaiInRange = async (res) => {
  try {
    const currentYear = new Date().getFullYear();

    const kyquyettoanForCurrentYear = await Kyquyettoan.findOne({
      where: {
        trangthai: true,
        ngaymo: { [Op.gte]: `${currentYear}-01-01` },
        ngaydong: { [Op.lte]: `${currentYear}-12-31` },
      },
    });


    if (!kyquyettoanForCurrentYear) {
      console.error('Kyquyettoan record not found or trangthai !== true for the current year');
      return;
    }

    const ngaymo = kyquyettoanForCurrentYear.ngaymo;
    const ngaydong = kyquyettoanForCurrentYear.ngaydong;

    const result = await Canhan.findAll({
      include: [
        {
          model: Tokhaithue,
          where: { caNhanId: null },
          required: false,
        },
      ],
    });


    const currentDate = new Date();
    const overdueCanhan = result.filter((item) => {
      const ngaydongDate = new Date(item.Kyquyettoan.ngaydong);
      return currentDate > ngaydongDate;
    });



    console.log("danh sách người dùng trễ hạn quyết toán thuế: ", result);
    res.render('admin/list', { result });

  } catch (error) {
    console.error('Error:', error);
    throw error; // You might want to throw the error to handle it outside of this function
  }
};
*/
/*
exports.treHanQTT = async (res) => {
  try {
    const currentYear = new Date().getFullYear();
    const kyquyettoanForCurrentYear = await Kyquyettoan.findOne({
      where: {
        trangthai: true,
        ngaymo: { [Op.gte]: `${currentYear}-01-01` },
        ngaydong: { [Op.lte]: `${currentYear}-12-31` },
      },
    });

    if (!kyquyettoanForCurrentYear) {
      console.error('Kyquyettoan record not found or trangthai !== true for the current year');
      return;
    }

    const ngaydong = kyquyettoanForCurrentYear.ngaydong;

    const overdueCanhan = await Canhan.findAll({
      include: [
        {
          model: Tokhaithue, as: 'to_khai_thues',
          required: false,
        },
        {
          model: Diachi, as: 'dia_chi'
        }
      ],
      where: {
        status: null,
        '$to_khai_thues.createdAt$': null,
      },
    });

    const filterCaNhanTreHan = overdueCanhan.filter((item) => {
      const ngaydongDate = new Date(ngaydong);
      return new Date() > ngaydongDate;
    });

    res.render('admin/list', { result: filterCaNhanTreHan, num: filterCaNhanTreHan.length, });

  } catch (error) {
    console.error('Error:', error);
    throw error; 
  }
};

exports.treHanQTT = async (res) => {
  try {
    const currentYear = new Date().getFullYear();
    const kyquyettoanForCurrentYear = await Kyquyettoan.findOne({
      where: {
        trangthai: true,
        ngaymo: { [Op.gte]: `${currentYear}-01-01` },
        ngaydong: { [Op.lte]: `${currentYear}-12-31` },
      },
    });

    if (!kyquyettoanForCurrentYear) {
      console.error('Kyquyettoan record not found or trangthai !== true for the current year');
      return;
    }

    const ngaydong = kyquyettoanForCurrentYear.ngaydong;

    const overdueCanhan = await Canhan.findAll({
      include: [
        {
          model: Tokhaithue,
          as: 'to_khai_thues',
          required: false,
          where: {
            createdAt: {
              [Op.or]: [
                { [Op.lt]: ngaydong },
                { [Op.gt]: `${currentYear}-12-31` },
              ],
            },
          },
        },
        {
          model: Diachi,
          as: 'dia_chi'
        }
      ],
      where: {
        status: null,
        '$to_khai_thues.id$': null,
      },
    });

    const filterCaNhanTreHan = overdueCanhan.filter((item) => {
      const ngaydongDate = new Date(ngaydong);
      return new Date() > ngaydongDate;
    });

   //await sendBatchEmails(filterCaNhanTreHan);
   // res.render('admin/list', { result: filterCaNhanTreHan, num: filterCaNhanTreHan.length });
   return filterCaNhanTreHan;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
*/

// danh sách cá nhân trễ hạn quyết toán thuế
exports.getTreHanData = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const kyquyettoanForCurrentYear = await Kyquyettoan.findOne({
      where: {
        trangthai: true,
        ngaymo: { [Op.gte]: `${currentYear}-01-01` },
        ngaydong: { [Op.lte]: `${currentYear}-12-31` },
      },
    });

    if (!kyquyettoanForCurrentYear) {
      console.error('Kỳ quyết toán không tồn tại.');
      return null;  
    }

    const ngaydong = kyquyettoanForCurrentYear.ngaydong;

    const overdueCanhan = await Canhan.findAll({
      include: [
        {
          model: Tokhaithue,
          as: 'to_khai_thues',
          required: false,
          where: {
            createdAt: {
              [Op.or]: [
                { [Op.lt]: ngaydong },
                { [Op.gt]: `${currentYear}-12-31` },
              ],
            },
          },
        },
        {
          model: Diachi,
          as: 'dia_chi'
        }
      ],
      where: {
        status: null,
        '$to_khai_thues.id$': null,
      },
    });

    const filterCaNhanTreHan = overdueCanhan.filter((item) => {
      const ngaydongDate = new Date(ngaydong);
      return new Date() > ngaydongDate;
    });

    return filterCaNhanTreHan;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// render để trang danh sách trễ hạn
exports.renderTreHanQTT = async (res, data) => {
  try {
    res.render('admin/list', { result: data, num: data.length });
  } catch (error) {
    console.error('Error rendering view:', error);
    throw error;
  }
};


// gửi mail thông báo 
exports.sendBatchEmails =  async (users) => {
  try {
    for (const user of users) {
      const emailSubject = 'Thông báo trễ hạn quyết toán thuế';
      const emailText = `Dear ${user.fullname},\n\nBạn đã quá hạn quyết toán.`;
      await mailer.sendMail(user.email, emailSubject, emailText);
    }
  } catch (error) {
    console.error('Lỗi khi gửi mail: ', error);
    throw error;
  }
}


