const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const {  deleteUser, getAllUser, update, findOne, getUser} = require("../controllers/canhan.controller");
const upload = require("../middleware/excelUpload");
const excelController = require("../controllers/excel.controller");
const tokhaithue = require("../controllers/tokhai.controller");
const uploadTokhai = require("../controllers/upload.controller");
const db = require("../models");
const userController = require("../controllers/upload.controller");
const { uploaduser } = require("../controllers/upload.user");
const { getAllToChuc, deleteToChuc } = require("../controllers/tochuc.controller");
const { signin } = require("../controllers/auth.controller");
const { checkUserRole, isAdmin } = require("../middleware/authJwt");
const File = db.noptokhai;

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  

  app.get('/admin',  [authJwt.verifyToken, authJwt.isAdmin], (req, res)=>{
    const user = req.session.user;
    console.log(user);
    res.render('admin/index', {user: user});
  });

  app.get("/update/:id", [authJwt.verifyToken, authJwt.isAdmin],findOne);         // lấy thông tin update cá nhân
  app.get("/deletecn/:id",[authJwt.verifyToken, authJwt.isAdmin], deleteUser);    // xóa cá nhân
  app.get("/list-user",[authJwt.verifyToken,authJwt.isAdmin], getAllUser);        // lấy danh sách tất cả người dùng cá nhân
  app.get("/list-dn",[authJwt.verifyToken, authJwt.isAdmin], getAllToChuc);       // lấy all danh sách doanh nghiệp/tổ chức
  app.get('/tokhaithue',[authJwt.verifyToken], getUser);         // tờ khai quyết toán thuế 02/qtt-tncn của cá nhân có thu nhập từ tiền lương/tiền công 
  app.post("/update/:id", [authJwt.verifyToken, authJwt.isAdmin],update);         // update cá nhân
  app.get("/delete/:id",[authJwt.verifyToken, authJwt.isAdmin], deleteToChuc);    // xóa 1 tổ chức/doanh nghiệp
  app.get("/getAll", excelController.getAllExcelFile);                            // read data từ form excel doanh nghiệp/tổ chức kê khai trả tiền lương/ tiền công cho cá nhân/tổ chức


  // upload file excel
  app.get("/upload-file", [authJwt.verifyToken, authJwt.isTochuc], (req, res)=>{
    const user = req.session.user;
    console.log(user);
    res.render('tochuc/upload', {user: user});
  });
  
  // homepage tổ chức/doanh nghiệp 
  app.get('/tochuc/', [authJwt.verifyToken, authJwt.isTochuc], (req, res)=>{
    const user = req.session.user;
    console.log(user);
    res.render('tochuc/index', {user: user});
  });
  

  // dữ liệu file excel được upload
  app.get('/tochuc/upload', [authJwt.verifyToken, authJwt.isTochuc], (req, res)=>{
    const user = req.session.user;
    console.log(user);
    res.render('tochuc/table', {user: user});
  });


  // danh sách các file được cá nhân upload
  app.get('/list-file-upload', (req, res) => {
    File.findAll().then(files => {
      res.render('admin/listFileUpload', {files});
    });
  });

  // download files
  app.get('/download', (req, res) => {
    const filePath = req.query.path;          // Lấy đường dẫn tệp từ tham số truy vấn
    res.download(filePath);                   // Gửi tệp về trình duyệt để tải về
  });


/*
  // tờ khai quyết toán thuế mẫu  02/qtt-tncn
  app.get("/tokhai", (req, res) => {
    res.render("nguoidung/tokhai.ejs")
  })
*/

  app.get('/canhan', (req, res) => {          // homepage cá nhân
    res.render("nguoidung/index.ejs");    
  })


// test routes
  app.get("/test", [authJwt.verifyToken, authJwt.isAdmin], (req, res)=>{
    const user = req.session.user;
    console.log(user);
    res.send("demo !!!", "user", user);
  })

// upload tờ khai
app.post("/upload", upload.single("file"), excelController.upload);


// nộp tờ khai quyết toán thuế nhu nhập cá nhân
app.get('/noptokhai', (req, res) => {
    File.findAll().then(files => {
      res.render('uploadfile', { files });
    });
  })

app.post('/tokhai', tokhaithue.create);


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


app.get("/create-user", [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
  res.render("admin/create");                           // form create cá nhân
});

app.get("/create-tochuc",[authJwt.verifyToken, authJwt.isAdmin],  (req, res) => {               // form create tổ chức
    res.render("admin/auth/create.tochuc.ejs");
});

app.get('/success', (req, res) => {
  res.render('admin/success'); // Render trang thông báo
});
//app.get("/list-dn", getAllToChuc);
//app.get('/canhan/demo',[authJwt.verifyToken, authJwt.isAdmin], getUser);


};
