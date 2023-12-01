const db = require("../models");
const config = require("../config/auth.config");
require('dotenv/config');
const mailer = require('../utils/mailer');
const crypto = require('crypto');
const flash = require('express-flash');
const Swal = require('sweetalert2');
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
const Canhan = db.canhan;
const Tochuc = db.tochuc;
const Admin = db.admin;
const Diachi = db.diachi;
const Tokhaithue = db.tokhaithue;
const Loaitokhai = db.loaitokhai;
const Trangthaixuly = db.trangthaixuly;
const express = require('express');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validateCCCD, validatePhone } = require("../middleware");
const { findOne } = require("./canhan.controller");

function generateRandomPassword() {
  return crypto.randomBytes(4).toString('hex');
}
/*
exports.CaNhanSignup = async (req, res) => {
  // Save User to Database
  try {

    const canhan = await Canhan.create({
      email: req.body.email,
      masothue: req.body.masothue,
      address: req.body.address,
      cccd: req.body.cccd,
      phone: req.body.phone,
      cqqtthue: req.body.cqqtthue,
      phuthuoc: req.body.phuthuoc,
      fullname: req.body.fullname,
    });

    const user = await User.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      canhanId: canhan.id
    });

    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });

      const result = user.setRoles(roles);
      if (result) {
        mailer.sendMail(canhan.email, "Đăng ký tài khoản thành công",
          `Xin chào ${canhan.fullname} <br>
      Bạn vừa được tạo tài khoản Quyết toán thuế TNCN thành công! <br>
      Tài khoản đăng nhập hệ thống của bạn:<br>
      - username: ${user.username} <br>
      - password: ${req.body.password}`);
        return res.redirect('/');
      }


    }

    else {
      // user has role = 1
      const result = user.setRoles([1]);
      if (result) {
        mailer.sendMail(canhan.email, "Đăng ký tài khoản thành công",
          `Xin chào ${canhan.fullname} <br>
        Bạn vừa được tạo tài khoản Quyết toán thuế TNCN thành công! <br>
        Tài khoản đăng nhập hệ thống của bạn:<br>
        - username: ${user.username} <br>
        - password: ${req.body.password}`);
        return res.render('admin/success-modal', { showSuccessModal: true });
      }
    }


  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
*/
exports.CaNhanSignup = async (req, res) => {
  try {
    const masothue = await this.randomMasothue();
    const randomPassword = generateRandomPassword();
    const canhan = await Canhan.create({
      email: req.body.email,
      masothue: masothue,
      cccd: req.body.cccd,
      phone: req.body.phone,
      cqqtthue: 'Cục thuế' + req.body.tinh_tp,
      phuthuoc: req.body.phuthuoc,
      fullname: req.body.fullname,
    });

    const diachi = await Diachi.create({
      tinh_tp: req.body.tinh_tp,
      quan_huyen: req.body.quan_huyen,
      xa_phuong: req.body.xa_phuong,
      caNhanId: canhan.id
    });

    const user = await User.create({
      username: canhan.masothue,
      password: bcrypt.hashSync(randomPassword, 8),
      caNhanId: canhan.id
    });

    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });

      const result = user.setRoles(roles);
      if (result) {
        mailer.sendMail(canhan.email, "Tạo tài khoản thành công",
          `Xin chào ${canhan.fullname} <br>
      Bạn vừa được tạo tài khoản admin trên hệ thống thành công! <br>
      Tài khoản đăng nhập hệ thống của bạn:<br>
      - username: ${user.username} <br>
      - password: ${randomPassword}`);
        return res.redirect('/');
      }
    }

    else {
      // user has role = 3
      const result = user.setRoles([1]);
      if (result) {
        mailer.sendMail(canhan.email, "Tạo tài khoản thành công",
          `Xin chào ${canhan.hoten} <br>
        Bạn vừa được tạo tài khoản Quyết toán thuế TNCN thành công! <br>
        Tài khoản đăng nhập hệ thống của bạn:<br>
        - username: ${user.username} <br>
        - password: ${randomPassword}`);
        return res.redirect('/list-user');
      }
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.ToChucSignup = async (req, res) => {
  // Save User to Database: 7 - not null
  try {
    const tochuc = await Tochuc.create({
      masothue: req.body.masothue,
      email: req.body.email,
      tentochuc: req.body.tentochuc,
      address: req.body.address,
      phone: req.body.phone,
      cqqtthue: req.body.cqqtthue,
      nhanvien: req.body.nhanvien,
      daidien: req.body.daidien,
    });

    const user = await User.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      toChucId: tochuc.id,
    });

    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });

      const result = user.setRoles(roles);
      if (result) res.send({ message: "User registered successfully!" });
    } else {
      // user has role = 1
      const result = user.setRoles([2]);
      if (result) res.send({ message: "User registered successfully!" });
    }

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.AdminSignup = async (req, res) => {
  // Save User to Database
  try {
    const randomPassword = generateRandomPassword();
    const admin = await Admin.create({
      macanbo: req.body.macanbo,
      masothue: req.body.masothue,
      hoten: req.body.hoten,
      coquanthue: req.body.coquanthue,
      email: req.body.email
    });

    const user = await User.create({
      username: req.body.macanbo,
      password: bcrypt.hashSync(randomPassword, 8),
      adminId: admin.id
    });

    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });

      const result = user.setRoles(roles);
      if (result) {
        mailer.sendMail(admin.email, "Tạo tài khoản thành công",
          `Xin chào ${admin.hoten} <br>
      Bạn vừa được tạo tài khoản admin trên hệ thống thành công! <br>
      Tài khoản đăng nhập hệ thống của bạn:<br>
      - username: ${user.username} <br>
      - password: ${randomPassword}`);
        return res.redirect('/');
      }
    }

    else {
      // user has role = 3
      const result = user.setRoles([3]);
      if (result) {
        mailer.sendMail(admin.email, "Tạo tài khoản thành công",
          `Xin chào ${admin.hoten} <br>
        Bạn vừa được tạo tài khoản Quyết toán thuế TNCN thành công! <br>
        Tài khoản đăng nhập hệ thống của bạn:<br>
        - username: ${user.username} <br>
        - password: ${randomPassword}`);
        return res.redirect('/admin-login');
      }
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/*
exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id },
      config.secret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    req.session.token = token;
    req.session.user = {
      id: user.id,
      username: user.username,
      toChucId: user.toChucId,
      adminId: user.adminId,
      caNhanId: user.caNhanId
    };

    return res.redirect("/admin")
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};*/

exports.TochucSignin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
      include: [{
        model: Tochuc, as: 'to_chuc'
      },]
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id },
      config.secret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    req.session.token = token;
    req.session.user = user;
    return res.redirect("/tochuc")
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

/*
exports.CanhanSignin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
      include: [{
        model: Canhan, as: 'ca_nhan',
        include: [{ model: Diachi, as: 'dia_chi' }]
      }]
    });

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!user) {
      req.flash('error', 'Mã số thuế không đúng!');
      return res.redirect('/canhan/login');
    }

    if (!passwordIsValid) {
      req.flash('error', 'Mã số thuế không đúng!');
      return res.redirect('/canhan/login');
    }


    const token = jwt.sign({ id: user.id },
      config.secret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    req.session.token = token;
    req.session.user = user;
    return res.redirect("/canhan")
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
*/

exports.CanhanSignin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
      include: [{
        model: Canhan, as: 'ca_nhan',
        include: [{ model: Diachi, as: 'dia_chi' }]
      }]
    });

    if (!user) {
      req.flash('error', 'Mã số thuế không đúng!');
      return res.redirect('/canhan/login');
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      req.flash('error', 'Mật khẩu không đúng!');
      return res.redirect('/canhan/login');
    }

    const token = jwt.sign({ id: user.id },
      config.secret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    req.session.token = token;
    req.session.user = user;
    return res.redirect("/canhan");
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};


exports.signout = async (req, res) => {
  try {
    req.session.token = null;
    req.session.user = null;
    return res.redirect("/")
  } catch (err) {
    this.next(err);
  }
};


exports.signin = async (req, res) => {
  try {

    const fixedUsername = 'CB123456';
    const fixedPassword = 'a81a8e15';

    if (req.body.username !== fixedUsername || req.body.password !== fixedPassword) {
      return res.status(401).send({
        message: "Invalid Username or Password!",
      });
    }

    const token = jwt.sign({ id: 1 },
      config.secret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400,
      });

    req.session.token = token;
    req.session.user = {
      id: 1,
      username: fixedUsername,
    };

    return res.redirect("/admin");
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const masothue = await this.randomMasothue();
    const { email, phuthuoc, fullname } = req.body;
    const cccd = req.body.cccd;
    const phone = req.body.phone;

    const existingCanhan = await Canhan.findOne({
      where: {
        [Op.or]: [
          { cccd: cccd },
          { phone: phone },
          { email: email }
        ]
      }
    });

    const errorMessages = {};
    if (existingCanhan) {
      errorMessages.push('Thông tin người dùng đã được đăng ký!');
    }

    if (existingCanhan) {
      errorMessages.duplicateUser = 'Thông tin người dùng đã được đăng ký!';
    }

    if (!validateCCCD(cccd)) {
      errorMessages.invalidCCCD = 'CCCD không hợp lệ. Vui lòng nhập đúng 12 chữ số.';
    }

    if (!validatePhone(phone)) {
      errorMessages.invalidPhone = 'Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 chữ số.';
    }

    if (Object.keys(errorMessages).length > 0) {
      req.flash('error', errorMessages);
      return res.render('nguoidung/register', { req: req, errorMessages });

    }

    const canhan = await Canhan.create({
      email: email,
      masothue: masothue,
      cccd: cccd,
      phone: phone,
      cqqtthue: 'Cục thuế' + req.body.tinh_tp,
      phuthuoc: phuthuoc,
      fullname: fullname,
      status: "đang chờ"
    });

    const { tinh_tp, quan_huyen, xa_phuong } = req.body;

    const diachi = await Diachi.create({
      tinh_tp: tinh_tp,
      quan_huyen: quan_huyen,
      xa_phuong: xa_phuong,
      caNhanId: canhan.id
    });

    req.flash('success', 'Thông tin đăng ký cấp Mã số thuế của bạn đã được ghi nhập. Vui lòng chờ phản hồi từ Cơ Quan Thuế');
    return res.render('nguoidung/register');

  } catch (error) {
    console.log(error);
    req.flash('error', 'Đã xảy ra lỗi trong quá trình đăng ký.');
    throw new Error(error);
  } finally {
    req.flash('success');
    req.flash('error');
  }
};

exports.createAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const canhan = await Canhan.findByPk(id);
    const randomPassword = generateRandomPassword();

    const existingCanhan = await Canhan.findOne({
      where: {
        [Op.or]: [
          { masothue: canhan.masothue },
          { email: canhan.email },
          { phone: canhan.phone }
        ]
      }
    });
    console.log('existingCanhan:', existingCanhan);
    if (existingCanhan.masothue !== canhan.masothue || existingCanhan.email !== canhan.email || existingCanhan.phone !== canhan.phone) {

      return res.redirect('/list-dang-ky-cap-mst?=failed');
    } else {
      const user = await User.create({
        username: canhan.masothue,
        password: bcrypt.hashSync(randomPassword, 8),
        caNhanId: canhan.id
      });

      const date = new Date(canhan.createdAt);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      const formattedTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

      await Canhan.update({ status: null }, { where: { id: id } });
      await user.setRoles([1]);
      await mailer.sendMail(
        canhan.email,
        "V/v Đăng ký thuế lần đầu",
        `Xin chào ${canhan.fullname}, bạn đã đăng ký thuế lần đầu vào lúc ${formattedTime} ngày ${formattedDate}. Đề nghị của bạn đã được duyệt. <br>
    Ban được cấp Mã số thế cá nhân là ${canhan.masothue}. Cơ quan quản lý thuế trực tiếp: ${canhan.cqqtthue}<br>
    Đăng nhập hệ thống quyết toán thuế thu nhập cá nhân bằng mã số thuế được cấp. Mật khẩu đăng nhập là: ${randomPassword}<br>`
      );

      return res.redirect('/list-user');
    }

    // Create a new user

  } catch (error) {
    console.error(error);
    req.flash('error', 'Đã xảy ra lỗi trong quá trình tạo tài khoản.');
    return res.redirect('/list-user');
  }
};


exports.randomMasothue = async (req, res) => {
  let isUnique = false;
  let masothue;
  while (!isUnique) {
    masothue = Math.floor(1000000000 + Math.random() * 9000000000);
    const existingCanhan = await Canhan.findOne({ where: { masothue: masothue } });
    if (!existingCanhan) {
      isUnique = true;
    }
  }
  return masothue;
}


// Trong hàm paginate
const paginate = async (model, condition, page = 1, perPage = 5) => {
  try {
    const result = await model.findAndCountAll({
      where: condition,
      limit: perPage,
      offset: (page - 1) * perPage,
      include: [
        { model: Loaitokhai, as: 'loai_to_khai' },
        { model: Canhan, as: 'ca_nhan' },
        { model: Trangthaixuly, as: 'trang_thai_xu_li' },
      ],
    });

    const totalPages = Math.ceil(result.count / perPage);

    return {
      items: result.rows,
      totalItems: result.count,
      totalPages: totalPages,
      currentPage: page,
    };
  } catch (error) {
    throw error;
  }
};


exports.getAllTokhai = async (req, res) => {
  try {
    const tokhaithue = await paginate(Tokhaithue, {}, req.query.page || 1, 10);
    res.render("admin/duyettokhai", { tokhaithue });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getListRegisterMST = async (req, res) => {
  try {
    const canhan = await Canhan.findAll({
      where: {
        status: 'đang chờ'
      },
      include: [{
        model: Diachi, as: 'dia_chi'
      }]
    });
    console.log(canhan);
    return res.render("admin/listMST", { canhan });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.deleteRegisterMST = async (req, res) => {
  try {
    const id = req.params.id;
    const canhan = await Canhan.findByPk(id);
    const email = canhan.email;
    mailer.sendMail(email, "Đề nghị cấp Mã Số Thuế của bạn không được duyệt");
    Canhan.destroy({
      where: {
        id: req.params.id
      },
    })
      .then(function (rowDeleted) {
        if (rowDeleted == 1) {
          console.log("deleted!!!");

          res.redirect('/list-dang-ky-cap-mst');
        }
      })
  } catch (error) {

  }
};