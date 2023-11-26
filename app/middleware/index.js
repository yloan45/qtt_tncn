const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");

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

module.exports = {
  authJwt,
  verifySignUp,
  checkDateValidity,
  validateInput
};
