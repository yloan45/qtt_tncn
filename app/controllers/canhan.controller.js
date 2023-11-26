
const db = require("../models");
require('dotenv/config');
const User = db.user;
const Canhan = db.canhan;
const Diachi = db.diachi;
const Tokhaithue = db.tokhaithue;
const Loaitokhai = db.loaitokhai;
const bcrypt = require('bcrypt');
const mailer = require('../utils/mailer');
const crypto = require('crypto');

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

exports.getAllUser = (req, res) => {
  Canhan.findAll({
    include: [
      {
        model: Diachi, as: 'dia_chi' // Sử dụng alias đúng ở đây
      },
      {
        model: User, as: 'user'
      }
    ]
  }).then((users) => {
    console.log(users);
    res.render("admin/listUser", {
      user: users,
    });
  })
    .catch((err) => console.log(err));
}


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
      return res.redirect('/edit-profile?=success');
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

  const user = await Canhan.findOne({
    where: {
      masothue: masothue
    },
  });

  if (!user) {
    console.log("không tìm thấy mst")
    req.flash('error', 'Không tìm thấy mã số thuế.');
    return res.redirect("/");
  }
  console.log(`thông tin user có mst: ${masothue} là:`, user )

  const email = user.email;
  console.log(`email user có mst: ${masothue} là:`, email )
  const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
  const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes

  otpDatabase.set(email, { otp, expirationTime });

  try {
    await  mailer.sendMail(user.email, "Xác nhận đổi mật khẩu", `
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
  if (user) {
    res.render('nguoidung/tokhaithue', {
      user: user
    });
  } else {
    res.status(404).json({ message: 'Người dùng không tồn tại' });
  }
}

/*
 const email = user.email;
  const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
  const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes

  otpDatabase.set(email, { otp, expirationTime });

  // Send email
  mailer.sendMail(email, "Xác nhận đổi mật khẩu",`
  Xin chào người dùng ${user.fullname},<br>
  Bạn vừa yêu cầu đổi mật khẩu, <br>
  Mã OTP của bạn là: ${otp}, <br>
  Vui lòng không cung cấp mã xác thực cho bất kỳ ai. Mã OTP có hiệu lực trong vòng 15 phút. 
  `)

*/