const db = require("../models");
const User = db.user;

const readXlsxFile = require("read-excel-file/node");

const uploaduser = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path =
      __basedir + "/uploads/excel/" + req.file.filename;

    readXlsxFile(path).then((rows) => {
      rows.shift();

      let users = [];

      rows.forEach((row) => {
        let excelfile = {
          username: row[0],
          masothue: row[1],
          fullname: row[2],
          cccd: row[3],
          address: row[4],
          phone: row[5],
          soluong: row[6],
          email: row[7],
          cqqlthue: row[8],
          password: row[9]
        };

        users.push(excelfile);
      });

      User.bulkCreate(users)
        .then(() => {
          res.redirect('/list-user');
        })
        .catch((error) => {
          res.status(500).send({
            message: "Fail to import data into database!",
            error: error.message,
          });
        });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

module.exports = {
  uploaduser
};