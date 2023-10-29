const { query } = require("express");
const db = require("../models");
const Excelupload = db.tochuckekhaithue;

const readXlsxFile = require("read-excel-file/node");

const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path =
      __basedir + "/uploads/excel/" + req.file.filename;

    readXlsxFile(path).then((rows) => {
      rows.shift();

      let excelupload = [];
      const toChucId = req.session.user.toChucId;
      console.log("tổ chức có id là: ", toChucId)
      rows.forEach((row) => {
        let excelfile = {
          tennv: row[0],
          masothue: row[1],
          namsinh: row[2],
          diachi: row[3],
          vitri: row[4],
          dienthoai: row[5],
          email: row[6],
          luong: row[7],
          toChucId: toChucId
        };

        excelupload.push(excelfile);
        console.log("tổ chức có id là: ", toChucId)
      });

      Excelupload.bulkCreate(excelupload)
        .then(() => {
          res.redirect('/getAll');
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

/*
const getAllExcelFile = (req, res) => {
  Excelupload.findAll()
    .then((data) => {
      res.render('admin/listdata.ejs', {data})
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error",
      });
    });
};
*/

const getAllExcelFile = async (req, res) => {
  const toChucId = req.session.user.toChucId;
 // const page = req.query.page || 1;
 // const pageSize = 5;
 // const {rows, count} = await paginate(Excelupload, {page, pageSize});
  Excelupload.findAll({ where: { toChucId } })
    .then((data) => {
      res.render('admin/listdata.ejs', { data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error",
      });
    });
};

const paginate = (query, {page, pageSize}) => {
  const offset = (page -1) * pageSize;
  //const limit = (pageSize - offset) * pageSize;
  const limit = pageSize;
  return query.findAndCountAll({offset, limit});
}

module.exports = {
  upload,
  getAllExcelFile,
  paginate
};