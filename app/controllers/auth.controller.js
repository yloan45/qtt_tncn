const db = require("../models");
const config = require("../config/auth.config");
require('dotenv/config');
const mailer = require('../utils/mailer');
const crypto = require('crypto');

const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
const Canhan = db.canhan;
const Tochuc = db.tochuc;
const Admin = db.admin;
const Diachi = db.diachi;
const Tokhaithue =  db.tokhaithue;
const Loaitokhai = db.loaitokhai;
const Trangthaixuly = db.trangthaixuly;

const express = require('express');
const app = express;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { checkUserRole } = require("../middleware/authJwt");

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
    const randomPassword = generateRandomPassword();
    const canhan = await Canhan.create({
      email: req.body.email,
      masothue: req.body.masothue,
      cccd: req.body.cccd,
      phone: req.body.phone,
      cqqtthue: req.body.cqqtthue,
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
      username: req.body.username,
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
};


exports.TochucSignin = async (req, res) => {
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
    req.session.user = user;
    return res.redirect("/tochuc")
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};


exports.CanhanSignin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!user || !passwordIsValid) {
      return res.status(404).send({ message: "User not found or Invalid password!" });
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
    return res.redirect("/canhan/")
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

/*
exports.getAllTokhai = async (req, res) => {
  Tokhaithue.findAll({
    include: [{
      model: Loaitokhai, as: 'loai_to_khai'
    },
    {
      model: Canhan, as: 'ca_nhan'
    },
    {
      model: Trangthaixuly, as: 'trang_thai_xu_li'
    }
  ]
  }
  ).then((tokhai) => {
    console.log(tokhai);
    
    res.render("admin/duyettokhai",
      { tokhai: tokhai});
  })
  .catch((err) => console.log(err));
}
*/
exports.getAllTokhai = async (req, res) => {
  Tokhaithue.findAll({
    include: [
      { model: Loaitokhai, as: 'loai_to_khai'},
      { model: Canhan, as: 'ca_nhan' },
      { model: Trangthaixuly, as: 'trang_thai_xu_li'},
    ]
  }).then((tokhai) => {
    console.log(tokhai);
    res.render("admin/duyettokhai", { tokhai: tokhai });
  }).catch((err) => console.log(err));
}
