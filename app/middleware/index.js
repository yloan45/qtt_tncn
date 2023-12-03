const db = require("../models");
const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const Kyquyettoan = db.kyquyettoan;
const Op = db.Sequelize.Op;
const Loaitokhai = db.loaitokhai;
const Canhan = db.canhan;
const Diachi = db.diachi;
const Tochuc = db.tochuc;
const Trangthaixuly = db.trangthaixuly;
const User = db.user;

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
      return res.status(403).json({
        error: 'Chưa đến thời gian quyết toán thuế!',
      });
    }

    const startDate = kyQuyetToan.ngaymo;
    const endDate = kyQuyetToan.ngaydong;

    const currentDate = new Date(kyQuyetToan.ngaymo);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; 
    const year = currentDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    const currentDate1 = new Date(kyQuyetToan.ngaydong);
    const day1 = currentDate1.getDate();
    const month1 = currentDate1.getMonth() + 1; 
    const year1 = currentDate1.getFullYear();
    const formattedDate1 = `${day1}-${month1}-${year1}`;

    if (new Date() < startDate || new Date() > endDate) {
      return res.status(403).json({
        error: `Chưa đến thời gian quyết toán thuế! Thời gian mở quyết toán thuế từ ${formattedDate} đến ${formattedDate1}`,
      });
    }

    req.kyQuyetToan = kyQuyetToan;
    next();
  } catch (error) {
    console.error(error);
    req.flash('error', 'Lỗi khi kiểm tra thời gian quyết toán');
    return res.redirect('/canhan');
  }
};

const isOpenCaNhan = async (req, res, next) => {
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
        error: `Chưa đến thời gian quyết toán thuế!`,
      });
    }

    const startDate = new Date(kyQuyetToan.ngaymo);
    const endDate = new Date(kyQuyetToan.ngaydong); //

    const currentDate = new Date(kyQuyetToan.ngaymo);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; 
    const year = currentDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;


    const currentDate1 = new Date(kyQuyetToan.ngaydong);
    const day1 = currentDate1.getDate();
    const month1 = currentDate1.getMonth() + 1; 
    const year1 = currentDate1.getFullYear();
    const formattedDate1 = `${day1}-${month1}-${year1}`;

    if (new Date() < startDate) {
      return res.status(403).json({
        error: `Chưa đến thời gian quyết toán thuế. Ngày bắt đầu từ ${formattedDate} đến ${formattedDate1}`,
      });
    } else if (new Date() > endDate){
      return res.status(403).json({
        error: `Đã kết thúc thời gian quyết toán thuế năm ${year}`,
      });
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
        ngaymotochuc: {
          [Op.between]: [new Date(`${currentYear}-01-01`), new Date(`${currentYear}-12-31`)],
        },
      },
    });

    if (!kyQuyetToan) {
      return res.status(403).json({
        error: `Chưa đến thời gian quyết toán thuế!`,
      });
    }

    const startDate = new Date(kyQuyetToan.ngaymotochuc);
    const endDate = new Date(kyQuyetToan.ngaydongtochuc); //

    const currentDate = new Date(kyQuyetToan.ngaymotochuc);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; 
    const year = currentDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;


    const currentDate1 = new Date(kyQuyetToan.ngaydongtochuc);
    const day1 = currentDate1.getDate();
    const month1 = currentDate1.getMonth() + 1; 
    const year1 = currentDate1.getFullYear();
    const formattedDate1 = `${day1}-${month1}-${year1}`;

    if (new Date() < startDate) {
      return res.status(403).json({
        error: `Chưa đến thời gian quyết toán thuế. Ngày bắt đầu từ ${formattedDate} đến ${formattedDate1}`,
      });
    } else if (new Date() > endDate){
      return res.status(403).json({
        error: `Bạn đã quá hạn kê khai quyết toán thuế.`,
      });
    }

    req.kyQuyetToan = kyQuyetToan;
    next();
  } catch (error) {
    console.error(error);
    req.flash('error', 'Lỗi khi kiểm tra thời gian quyết toán');
    return res.redirect('/canhan');
  }
};

const validateCCCD = (cccd) => {
  const cccdRegex = /^[0-9]{12}$/;
  return cccdRegex.test(cccd);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};


// Trong hàm paginate
/*
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
*/
const paginate = async (model, condition, page = 1, perPage = 5, includes = []) => {
  try {
    const includeOptions = includes.map(inc => ({ model: inc.model, as: inc.as }));

    const result = await model.findAndCountAll({
      where: condition,
      limit: perPage,
      offset: (page - 1) * perPage,
      include: includeOptions,
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


module.exports = {
  authJwt,
  verifySignUp,
  checkDateValidity,
  validateInput,
  isStrongPassword,
  isOpen, isOpenTochuc,
  validateCCCD, validatePhone,
  isOpenCaNhan,
  paginate,  
};
