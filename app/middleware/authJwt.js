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

verifyTokenCanhan = (req, res, next) => {
  let token = req.session.token;
  if (!token) {
    return res.redirect('/canhan/login');
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

verifyTokenTochuc = (req, res, next) => {
  let token = req.session.token;
  if (!token) {
    return res.redirect('/tochuc/login');
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
    return res.status(403).send(`<script>alert('Yêu cầu quyền truy cập Admin');  window.location.href = '/api/auth/signout';</script>`);
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
    return res.status(403).send(`<script>alert('Yêu cầu quyền tổ chức');  window.location.href = '/api/auth/signout';</script>`);
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate User role!",
    });
  }
};


isCanhan = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "canhan") {
        return next();
      }
    }
    return res.status(403).send(`<script>alert('Yêu cầu quyền truy cập cá nhân');  window.location.href = '/api/auth/signout';</script>`);
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate User role!",
    });
  }
};



function checkUserRole(role) {
  return (req, res, next) => {
    const user = req.session.user;
    if (user && user.authorities.includes(role)) {
      next();
    } else {
      res.redirect('/error');
    }
  };
}

const authJwt = {
  verifyToken,
  verifyTokenCanhan,
  verifyTokenTochuc,
  isAdmin,
  isTochuc, isCanhan
};
module.exports = authJwt;
