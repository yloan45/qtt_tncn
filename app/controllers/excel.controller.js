const db = require("../models");
const Excelupload = db.excelupload;

const readXlsxFile = require("read-excel-file/node");

const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path =
      __basedir + "/uploads/" + req.file.filename;

    readXlsxFile(path).then((rows) => {
      rows.shift();

      let excelupload = [];

      rows.forEach((row) => {
        let excelfile = {
          tennv: row[0],
          masothue: row[1],
          namsinh: row[2],
          diachi: row[3],
          vitri: row[4],
          dienthoai: row[5],
          email: row[6],
          luong: row[7]
        };

        excelupload.push(excelfile);
      });

      Excelupload.bulkCreate(excelupload)
        .then(() => {
          res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
            // render dữ liệu
          });
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

const getAllExcelFile = (req, res) => {
  Excelupload.findAll()
    .then((data) => {
      res.send(data);
      //render dữ liệu
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error",
      });
    });
};

module.exports = {
  upload,
  getAllExcelFile,
};