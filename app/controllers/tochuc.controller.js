const db = require("../models");

const User = db.user;
const Tochuc = db.tochuc;
const ExcelUpload = db.tochuckekhaithue;

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
  Tochuc.findAll().then((users) => {
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