const db = require("../models");
const config = require("../config/auth.config");
require('dotenv/config');
const mailer = require('../utils/mailer');

const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
const Canhan = db.canhan;
const Tochuc = db.tochuc;
const Diachi = db.diachi;

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
        model: Diachi, as: 'dia_chis' // Sử dụng alias đúng ở đây
      },
      {
        model: User, as: 'user'
      }
    ]
  }).then((users) => {
    console.log(users);
    res.render("admin/listUser", { user: users });
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

exports.getUser = async (req, res) => {
  const userId = req.session.user.id;
  const user = await User.findByPk(userId, {
    include: {
      model: Canhan,
      as: 'ca_nhan',
      include: {
        model: Diachi,
        as: 'dia_chis'
      }
    }
  });
  if (user) {
      res.render('nguoidung/tokhaithue', {user: user});
  } else {
    res.status(404).json({ message: 'Người dùng không tồn tại' });
  }

}