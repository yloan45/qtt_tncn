const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const Canhan = db.canhan;
const Tochuc = db.tochuc;

checkCaNhan = async (req, res, next) => {
  try {

    // Username
    let user = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (user) {
      return res.status(400).send({
        message: "Failed! Username is already in use!"
      });
    }

    // Email
    let canhan = await Canhan.findOne({
      where: {
        email: req.body.email
      }
    });

    if (canhan) {
      return res.status(400).send({
        message: "Failed! Email is already in use!"
      });
    }


    next();
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};

checkToChuc = async (req, res, next) => {
  try {
    // Username
    let user = await User.findOne({
      where: {
        username: req.body.username
      }
    });
    if (user) {
      return res.status(400).send({
        message: "Failed! Username is already in use!"
      });
    }
    // Email
    let tochuc = await Tochuc.findOne({
      where: {
        email: req.body.email
      }
    });

    if (tochuc) {
      return res.status(400).send({
        message: "Failed! Email is already in use!"
      });
    }
    next();
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
}


checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  }
  
  next();
};

const verifySignUp = {
  checkCaNhan, checkToChuc,
  checkRolesExisted
};

module.exports = verifySignUp;
