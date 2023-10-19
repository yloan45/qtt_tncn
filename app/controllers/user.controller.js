const db = require("../models");
const Masothue = db.mst;


exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.redirect('/admin/homepage')
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};


