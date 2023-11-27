const db = require("../models");
const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const Kyquyettoan = db.kyquyettoan;
const Op = db.Sequelize.Op;

const validateInput = (req, res, next) => {
  const { tokhai, trangthaixuly, startDate, endDate } = req.body;
  if (!tokhai || !trangthaixuly || !startDate || !endDate) {
    req.flash('error', 'Vui lòng nhập đầy đủ thông tin để tra cứu!');
    return res.redirect('/tra-cuu-to-khai');
  }
  next();
};


const checkDateValidity = (req, res, next) => {
  const { startDate, endDate } = req.body;
  const startDatetime = new Date(startDate + 'T00:00:00Z');
  const endDatetime = new Date(endDate + 'T23:59:59Z');

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  if (startDatetime >= currentDate) {
    return res.render('nguoidung/tra-cuu-to-khai', { startError: true, startError: 'Ngày gửi không được quá ngày hiện tại!' });
  }

  if (endDatetime < startDatetime) {
    return res.render('nguoidung/tra-cuu-to-khai', { endError: true, endError: 'Ngày kết thúc không được ít hơn  ngày hiện tại!' });
  }

  next(); // Chuyển tiếp nếu không có lỗi
};

const isStrongPassword = (password) => {
  if (password.length < 6) {
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  if (!/[!@#$%^&*()-=_+]/.test(password)) {
    return false;
  }
  return true;
}

const isOpen = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const kyQuyetToan = await Kyquyettoan.findOne({
      where: {
        trangthai: true,
        ngaymo: {
          [Op.between]: [new Date(`${currentYear}-01-01`), new Date(`${currentYear}-12-31`)],
        },
      },
    });

    if (!kyQuyetToan) {
     // req.flash('error', 'Chưa đến thời gian quyết toán hoặc đã qua thời gian quyết toán');
     // console.log('Chưa đến thời gian quyết toán hoặc đã qua thời gian quyết toán');
     // return res.redirect('/canhan'); 
     return res.status(403).json({
      error: 'Chưa đến thời gian quyết toán thuế!',
    });

    }

    const endDate = new Date(kyQuyetToan.ngaydong);
    if (new Date() > endDate) {
      return res.status(403).json({
        error: 'Bạn đã quá hạn quyết toán thuế!',
      });
      //req.flash('error', 'Quá hạn quyết toán');
     // console.log('Quá hạn quyết toán');
     // return res.redirect('/canhan');
    }

    req.kyQuyetToan = kyQuyetToan;
    next();
  } catch (error) {
    console.error(error);
    req.flash('error', 'Lỗi khi kiểm tra thời gian quyết toán');
    return res.redirect('/canhan');
  }
};



const isOpenTochuc = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const kyQuyetToan = await Kyquyettoan.findOne({
      where: {
        trangthai: true,
        ngaymo: {
          [Op.between]: [new Date(`${currentYear}-01-01`), new Date(`${currentYear}-12-31`)],
        },
      },
    });

    if (!kyQuyetToan) {
     return res.status(403).json({
      error: 'Chưa đến thời gian quyết toán thuế!',
    });
    }

    const endDate = new Date(kyQuyetToan.ngaydong);
    if (new Date() > endDate) {
      return res.status(403).json({
        error: 'Bạn đã quá hạn quyết toán thuế!',
      });
    }

    req.kyQuyetToan = kyQuyetToan;
    next();
  } catch (error) {
    console.error(error);
    req.flash('error', 'Lỗi khi kiểm tra thời gian quyết toán');
    return res.redirect('/tochu/upload');
  }
};

module.exports = {
  authJwt,
  verifySignUp,
  checkDateValidity,
  validateInput,
  isStrongPassword,
  isOpen, isOpenTochuc
};
