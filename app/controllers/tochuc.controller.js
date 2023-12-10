const db = require("../models");

const User = db.user;
const Tochuc = db.tochuc;
const ExcelUpload = db.tochuckekhaithue;
const Diachi = db.diachi;


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
    //include: [{ model: Diachi, as: 'dia_chi' }]
  });
  try {
    const [num] = await Tochuc.update(req.body, {
      where: { id: id },

    });
/*
    const [address] = await Diachi.update(req.body, {
      where: {
        id: user.dia_chi.id
      }
    })
*/
    if (num > 0 ) {
      req.flash('success', 'Cập nhật thông tin thành công!');
      return res.redirect('/tochuc/cap-nhat-thong-tin?=success');
    } else {
      req.flash('error', 'Không thể cập nhật người dùng');
      return res.redirect('/tochuc/cap-nhat-thong-tin?=false');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    req.flash('error', 'Đã xảy ra lỗi khi cập nhật thông tin.');
    return res.redirect('/tochuc/cap-nhat-thong-tin?=error');
  }
};
