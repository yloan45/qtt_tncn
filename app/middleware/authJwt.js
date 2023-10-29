const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.redirect('/admin-login');
  }

  jwt.verify(token,
    config.secret,
    (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      req.userId = decoded.id;
      next();
    });
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate User role!",
    });
  }
};

isTochuc = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "tochuc") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Admin Tochuc!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate User role!",
    });
  }
};

function checkUserRole(role) {
  return (req, res, next) => {
    const user = req.session.user; // Lấy thông tin người dùng từ phiên

    // Kiểm tra quyền của người dùng
    if (user && user.authorities.includes(role)) {
      // Người dùng có quyền, tiếp tục xử lý
      next();
    } else {
      // Người dùng không có quyền, đưa họ đến trang lỗi hoặc trang yêu cầu quyền
      res.redirect('/error'); // Hoặc trang lỗi
    }
  };
}

const authJwt = {
  verifyToken,
  isAdmin,
  isTochuc,
  checkUserRole
};
module.exports = authJwt;
