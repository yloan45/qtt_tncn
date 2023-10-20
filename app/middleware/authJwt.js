const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Masothue = db.mst;


verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
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

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
          // redirect admin
        }
      }
      res.status(403).send({
        message: "Yêu cầu quyền có quyền admin!"
      });
      return;
    });
  });
};

isTochuc = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "tochuc") {
          next();
          return;
          // redirect tochuc
        }
      }
      res.status(403).send({
        message: "Yêu cầu quyền có quyền tổ chức!"
      });
    });
  });
};

isTochucOrCanhan = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "tochuc") {
          next();
          return;
          // redirect tochuc
        }

        if (roles[i].name === "canhan") {
          next();
          return;
          // redirect canhan
        }
      }
      res.status(403).send({
        message: "Yêu cầu có quyền tổ chức hoặc quyền cá nhân!"
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  idTochuc: isTochuc,
  isTochucOrCanhan: isTochucOrCanhan
};
module.exports = authJwt;
