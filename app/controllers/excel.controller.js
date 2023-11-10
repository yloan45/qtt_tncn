const { query } = require("express");
const db = require("../models");
const Excelupload = db.tochuckekhaithue;
const Duyettokhai = db.duyettokhai;
const Admin = db.admin;
const Tokhaithue = db.tokhaithue;
const readXlsxFile = require("read-excel-file/node");
const Tochuc = db.tochuc;

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
          hoten: row[1],
          cccd: row[3],
          masothue: row[2],
          email: row[4],
          dienthoai: row[5],
          diachi: row[6],
          thunhaptinhthue: row[8],
          ghichu: row[9],
          toChucId: toChucId
        };
        excelupload.push(excelfile);
        console.log("tổ chức có id là: ", toChucId)
      });

      Excelupload.bulkCreate(excelupload)
        .then(() => {
          res.redirect('/tochuc/upload');
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
      res.render('tochuc/listdata.ejs', {data})
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error",
      });
    });
};

const getTochucUser = async (req, res) => {
  const id = req.params.id;
  const excelupload = await Excelupload.findByPk(id);
  if(excelupload){
    const tochuc = await Tochuc.findByPk(excelupload.toChucId);
    console.log(excelupload);
    res.json({excelupload, tochuc});
  } else {
    res.json(null);
  }
};

const getToChucUploadFile = async (req, res) => {
  const toChucId = req.session.user.toChucId;
  Excelupload.findAll({ where: { toChucId } })
    .then((data) => {
      res.render('tochuc/table.ejs', { data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error",
      });
    });
};



module.exports = {
  upload,
  getAllExcelFile,
  getToChucUploadFile,
  getTochucUser
};