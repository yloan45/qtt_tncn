const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const { getAllMST, deleteUser, deleteAll, getAllUser, update, getAllFile, uploadfile } = require("../controllers/auth.controller");
const upload = require("../middleware/excelUpload");
const excelController = require("../controllers/excel.controller");

const uploadTokhai = require("../controllers/upload.controller");
const db = require("../models");
const File = db.file;


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //app.get("/listall", getAllMST);
  app.get("/delete/:id", deleteUser);

  app.get("/list-user", getAllUser);
  app.post("/update/:id", update);

  app.get("/tokhai", (req, res) => {
    res.render("nguoidung/tokhai.ejs")
  })

  app.get("/upload-file", (req, res) => {
    res.render("tochuc/upload")
  });
  app.get("/getAll", excelController.getAllExcelFile);

  app.post("/upload", upload.single("file"), excelController.upload);

  app.get('/noptokhai', (req, res) => {
    File.findAll().then(files => {
      res.render('uploadfile', { files });
    });
  })

  // Xử lý việc tải lên tệp
app.post('/noptokhai', uploadTokhai.single('filename'), (req, res) => {
  File.create({
    fullname: req.body.fullname,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    tokhai: req.body.tokhai02,
    filename: req.file.filename,
    filePath: req.file.path
  }).then(() => {
    res.redirect('/list-file-upload');
  });
});


app.get('/list-file-upload', (req, res) => {
  File.findAll().then(files => {
    res.render('listfile', {files});
  });
});

app.get('/download', (req, res) => {
  const filePath = req.query.path; // Lấy đường dẫn tệp từ tham số truy vấn
  res.download(filePath); // Gửi tệp về trình duyệt để tải về
});


};
