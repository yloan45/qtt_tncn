const { query } = require("express");
const db = require("../models");
const Excelupload = db.tochuckekhaithue;
const Duyettokhai = db.duyettokhai;
const Admin = db.admin;
const Tokhaithue = db.tokhaithue;
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
          hoten: row[1],
          cccd: row[2],
          masothue: row[3],
          email: row[4],
          dienthoai: row[5],
          diachi: row[6],
          vitricongviec: row[7],
          hopdonglaodong: row[8],
          tuthang: row[9],
          denthang: row[10],
          khautruthue: row[11],
          muckhautru: row[12],
          mucluong: row[13],
          dakhautru: row[14],
          tongthunhap: row[15],
          ghichu: row[16],
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

const paginate = (query, {page, pageSize}) => {
  const offset = (page -1) * pageSize;
  //const limit = (pageSize - offset) * pageSize;
  const limit = pageSize;
  return query.findAndCountAll({offset, limit});
}


module.exports = {
  upload,
  getAllExcelFile,
  paginate,
  getToChucUploadFile
};