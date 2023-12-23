const { query } = require("express");
const db = require("../models");
const Excelupload = db.tochuckekhaithue;
const readXlsxFile = require("read-excel-file/node");
const { paginate } = require("../middleware");
const Tochuc = db.tochuc;
const Op = db.Sequelize.Op;

/*
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
*/
/*const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Vui lòng chọn file excel để upload!");
    }
    let path = __basedir + "/uploads/excel/" + req.file.filename;
    readXlsxFile(path).then(async (rows) => {
      rows.shift();
      let excelupload = [];
      const toChucId = req.session.user.toChucId;
      console.log("Tổ chức có ID là: ", toChucId);

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
          toChucId: toChucId,
        };
        excelupload.push(excelfile);
      });

      await Excelupload.destroy({
        where: { masothue: { [Op.in]: excelupload.map((row) => row.masothue) }, toChucId: toChucId }
      });

      await Excelupload.bulkCreate(excelupload);
     // res.redirect("/tochuc/upload");
     return res.status(400).send("success","Vui lòng chọn file excel để upload!");
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};
*/

/*
const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Vui lòng chọn file excel để upload!");
    }
    let path = __basedir + "/uploads/excel/" + req.file.filename;
    readXlsxFile(path).then(async (rows) => {
      rows.shift();
      let excelupload = [];
      const toChucId = req.session.user.toChucId;
      console.log("Tổ chức có ID là: ", toChucId);

      rows.forEach((row) => {
        let excelfile = {
          hoten: row[1],
          cccd: row[3],
          masothue: row[2],
          email: row[4],
          dienthoai: row[5],
          diachi: row[6],
          thunhaptinhthue: row[8],
          namkekhai: row[9],
          ghichu: row[10],
          toChucId: toChucId,
        };
        excelupload.push(excelfile);
      });

      await Excelupload.destroy({
        where: { masothue: { [Op.in]: excelupload.map((row) => row.masothue) }, toChucId: toChucId }
      });

      await Excelupload.bulkCreate(excelupload);

      // Send success message to the client
      res.status(200).send({ message: "Upload file thành công!" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Không thể upload file: " + req.file.originalname,
    });
  }
};
*/

const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Vui lòng chọn file excel để upload!");
    }
    let path = __basedir + "/uploads/excel/" + req.file.filename;
    readXlsxFile(path).then(async (rows) => {
      rows.shift();
      let excelupload = [];
      const toChucId = req.session.user.toChucId;
      console.log("Tổ chức có ID là: ", toChucId);

      for (const row of rows) {
        let excelfile = {
          hoten: row[1],
          cccd: row[3],
          masothue: row[2],
          email: row[4],
          dienthoai: row[5],
          diachi: row[6],
          tongthunhap: row[8],
          thunhaptinhthue: row[7],
          namkekhai: row[9],
          ghichu: row[10],
          toChucId: toChucId,
        };

        const existingRecord = await Excelupload.findOne({
          where: {
            masothue: excelfile.masothue,
            namkekhai: excelfile.namkekhai,
            toChucId: toChucId,
          },
        });

        if (existingRecord) {
          await Excelupload.update(excelfile, {
            where: {
              masothue: excelfile.masothue,
              namkekhai: excelfile.namkekhai,
              toChucId: toChucId,
            },
          });
        } else {
          excelupload.push(excelfile);
        }
      }

      await Excelupload.bulkCreate(excelupload);

      res.status(200).send({ message: "Upload file thành công!" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Không thể upload file: " + req.file.originalname,
    });
  }
};


const getAllExcelFile = async (req, res) => {
try {
  const data = await paginate(Excelupload, {}, req.query.page || 1, 25, [
    {
      model: Tochuc, as: 'to_chuc'
    }
  ]);
  res.render('admin/listdata.ejs', {data})
} catch (error) {
  console.error(err);
    res.status(500).send('Internal Server Error');
}
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