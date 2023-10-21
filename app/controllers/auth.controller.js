const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Masothue = db.mst;

require('dotenv/config');
const mailer = require('../utils/mailer');

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    fullname: req.body.fullname,
    address: req.body.address,
    cqqtthue: req.body.cqqtthue,
    phone: req.body.phone,
    cccd: req.body.cccd,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.redirect("/list-user")
        });
      }

      mailer.sendMail(user.email, "Đăng ký tài khoản thành công",
        `Xin chao ${user.fullname} <br>
      Bạn vừa được tạo tài khoản Quyết toán thuế TNCN thành công! <br>
      Tài khoản đăng nhập hệ thống cua ban:<br>
      - username: ${user.username} <br>
      - password: ${req.body.password}`)
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

const signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id },
        config.secret,
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: 86400, // 24 hours
        });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        return res.render("admin/homepage", {
          user
        })
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};


// get all mã số thuế
const getAllMST = (req, res) => {
  Masothue.findAll().then((masothue) => {
    res.render("admin/listMST.ejs",
      { maso: masothue });
  })
    .catch((err) => console.log(err));
}


// xóa mã số thuế
const deleteUser = (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(function (rowDeleted) {
      if (rowDeleted == 1) {
        console.log("deleted!!!");
        res.redirect('/list-user');
      }
    })
}


// get all mã số thuế
const getAllUser = (req, res) => {
  User.findAll().then((users) => {
    res.render("admin/listUser",
      { user: users });
  })
    .catch((err) => console.log(err));
}

// get user

const findOne = (req, res) => {
  const id = req.params.id;
  User.findByPk(id).then((data) => {
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


// update user
const update = (req, res) => {
  const id = req.params.id;
  User.update(req.body, { where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.redirect("/list-user");
      } else {
        res.send('Unable to update the user');
      }
    })
}

module.exports = {
  signin, signup,
  update, deleteUser,
  getAllUser, findOne, getAllMST

}