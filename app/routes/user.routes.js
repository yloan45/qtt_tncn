const { authJwt } = require("../middleware");
const {  deleteUser, getAllUser, update, findOne, getUser, getAllTokhaithue} = require("../controllers/canhan.controller");
const upload = require("../middleware/excelUpload");
const excelController = require("../controllers/excel.controller");
const tokhaithue = require("../controllers/tokhai.controller");
const db = require("../models");
const { getAllToChuc, deleteToChuc } = require("../controllers/tochuc.controller");
const { getAllTokhai } = require("../controllers/auth.controller");
const File = db.file; // nhầm lẫn giữa file phụ lục và file nộp tờ khai
const {getTokhaithue, duyettokhai, tokhaikhongduocduyet, checkTokhai, getListAllTongThuNhap} = require("../controllers/admin.controller");
const Tokhaithue = db.tokhaithue;
const Trangthaixuly = db.trangthaixuly;
const Duyettokhai = db.duyettokhai;
const path = require('path');
const { uploadPhuluc } = require("../controllers/upload.controller");
const Phuluc = db.phuluc;
const Tokhai = db.tokhaithue;
const Loaitokhai = db.loaitokhai;

const {generateCaptcha} = require('../controllers/tokhai.controller') 
const generateRandomCode = require('../utils/generateRandomCode');

let currentCaptchaB3 = generateCaptcha(); 
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
  //app.get('/duyet-to-khai/:id', [authJwt.verifyToken, authJwt.isAdmin], findOneTokhaithue);
  app.get("/update/:id", [authJwt.verifyToken, authJwt.isAdmin],findOne);         // lấy thông tin update cá nhân
  app.get("/deletecn/:id",[authJwt.verifyToken, authJwt.isAdmin], deleteUser);    // xóa cá nhân
  app.get("/list-user",[authJwt.verifyToken,authJwt.isAdmin], getAllUser);        // lấy danh sách tất cả người dùng cá nhân
  app.get("/list-dn",[authJwt.verifyToken, authJwt.isAdmin], getAllToChuc);       // lấy all danh sách doanh nghiệp/tổ chức
   app.post("/update/:id", [authJwt.verifyToken, authJwt.isAdmin],update);         // update cá nhân
  app.get("/delete/:id",[authJwt.verifyToken, authJwt.isAdmin], deleteToChuc);    // xóa 1 tổ chức/doanh nghiệp
  app.get("/getAll", excelController.getAllExcelFile);                            // read data từ form excel doanh nghiệp/tổ chức kê khai trả tiền lương/ tiền công cho cá nhân/tổ chức
  app.get('/tokhaithue/:id', [authJwt.verifyToken, authJwt.isAdmin], getTokhaithue);


  // upload file excel
  app.get("/tochuc/upload-file", [authJwt.verifyTokenTochuc, authJwt.isTochuc], (req, res)=>{
    const user = req.session.user;
    console.log(user);
    res.render('tochuc/upload', {user: user});
  });
  
  // homepage tổ chức/doanh nghiệp 
  app.get('/tochuc/', [authJwt.verifyTokenTochuc, authJwt.isTochuc], (req, res)=>{
    const user = req.session.user;
    console.log(user);
    res.render('tochuc/index', {user: user});
  });
  
  app.get('/tochuc/update/:id',[authJwt.verifyToken, authJwt.isTochuc], excelController.getTochucUser);             // get one
  app.get('/tochuc/upload', [authJwt.verifyTokenTochuc, authJwt.isTochuc], excelController.getToChucUploadFile);    // get all



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

  app.get('/canhan',[authJwt.verifyTokenCanhan], (req, res) => {          // homepage cá nhân
    res.render("nguoidung/index.ejs");    
  })

  app.get('/check', (req, res)=> {
    res.render("admin/check.ejs");
  });


  // duyệt tờ khai demo
//app.post('/duyet/:id', [authJwt.verifyToken, authJwt.isAdmin], duyetTokhai);
// upload tờ khai
app.post("/upload", upload.single("file"), excelController.upload);


// nộp tờ khai quyết toán thuế nhu nhập cá nhân
app.get('/noptokhai', (req, res) => {
    File.findAll().then(files => {
      res.render('uploadfile', { files });
    });
  })


/*BƯỚC 1 TẠO TỜ KHAI QTT*/
app.get('/tokhaithue',[authJwt.verifyTokenCanhan], getUser);          // step 1  
app.post('/tokhai/b1', tokhaithue.create);                            // post step 1

/* BƯỚC 2 TẠO TỜ KHAI QTT */
app.get("/tokhai/b2", (req, res)=>{
  res.render('nguoidung/upload_phuluc')                               // get step 2
});
app.post('/tokhai/b2', async (req, res) => {                          // post step 2
  const tokhaiData = req.session.tokhaiData;
  await tokhaithue.createTokhaiStep2(req, res, tokhaiData);
});

app.get('/success', ( req, res) => {
  const tokhaiData = req.session.tokhaiData;
  res.render('nguoidung/tokhai_success', {tokhaiData});
});


app.get('/captcha1', (req, res) => {
  tokhaithue.currentCaptchaB3 = tokhaithue.generateCaptcha();
  res.type('svg');
  res.status(200).send(currentCaptchaB3.data);
});

app.get('/captcha-b3', (req, res) => {
  res.render('nguoidung/tokhaiCaptcha');
});

app.post('/tokhai/b3', async (req, res) => {
  const userEnteredCaptcha = req.body.captcha; 
  console.log(tokhaithue.currentCaptchaB3.text);
  if(userEnteredCaptcha === tokhaithue.currentCaptchaB3.text){
  res.redirect('/success');
  } else {
    res.status(400).send('Xác thực captcha không thành công!');
  }
});


/*app.post('/tokhai/b1', async (req, res) => {
  const loaitokhai = await Loaitokhai.findOne({
    where: {
      tenloai: 'Tờ khai chính thức'
    }
  });
  const tokhaiData = {
    fullname: req.body.fullname,
    address: (req.body.xa_phuong || '') + ', ' + (req.body.quan_huyen || '') + ', ' + (req.body.tinh_tp || ''),
    dienthoai: req.body.phone,
    masothue: req.body.masothue,
    email: req.body.email,
    namkekhai: req.body.year,
    tokhai: req.body.tokhai,
    loaitokhai: req.body.loaitokhai,
    cucthue: req.body.cucthue,
    chicucthue: req.body.chicucthue,
    tuthang: req.body.tungay,
    denthang: req.body.denngay,
    ct22: req.body.ct22,
    ct23: req.body.ct23,
    ct24: req.body.ct24,
    ct25: req.body.ct25,
    ct26: req.body.ct26,
    ct27: req.body.ct27,
    ct28: req.body.ct28,
    ct29: req.body.ct29,
    ct30: req.body.ct30,
    ct31: req.body.ct31,
    ct32: req.body.ct32,
    ct33: req.body.ct33,
    ct34: req.body.ct34,
    ct35: req.body.ct35,
    ct36: req.body.ct36,
    ct37: req.body.ct37,
    ct38: req.body.ct38,
    ct39: req.body.ct39,
    ct40: req.body.ct40,
    ct41: req.body.ct41,
    ct42: req.body.ct42,
    ct43: req.body.ct43,
    ct44: req.body.ct44,
    ct45: req.body.ct45,
    ct46: req.body.ct46,
    ct47: req.body.ct47,
    ct48: req.body.ct48,
    ct49: req.body.ct49,
    caNhanId: req.session.user.caNhanId,
    loaiToKhaiId: loaitokhai.id,
    trangThaiXuLiId: 1,
  };

  req.session.tokhaiData = tokhaiData;
  res.redirect('/tokhai/b2');
});*/



// Xử lý việc tải lên tệp  => cập nhật lại sau, 
app.post('/noptokhai', uploadPhuluc, (req, res) => {
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

app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../public/uploads/', filename);
  res.sendFile(filePath);
});

app.get("/duyet-to-khai", [authJwt.verifyToken, authJwt.isAdmin], getAllTokhai);

app.get("/create-user", [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
  res.render("admin/create");                                                                   // form create cá nhân
});

app.get("/create-tochuc",[authJwt.verifyToken, authJwt.isAdmin],  (req, res) => {               // form create tổ chức
    res.render("admin/auth/create.tochuc.ejs");
});


// duyệt tờ khai
app.put('/capnhattrangthai/:id', [authJwt.verifyToken, authJwt.isAdmin], duyettokhai);
app.put('/duyet-to-khai/:id', [authJwt.verifyToken, authJwt.isAdmin], tokhaikhongduocduyet);

/*
app.post('/filter-tokhai', async (req, res) => {
  const selectedStatusId = req.body.statusId;
  let whereClause = {};

  if (selectedStatusId !== 'all') {
    whereClause = { trangThaiXuLiId: selectedStatusId };
  }
  const tokhais = await Tokhaithue.findAll({ where: whereClause });
  res.render('admin/duyettokhai', { tokhais });
});
*/

  app.post('/check-status/:id', checkTokhai);
  app.get('/demo-get-list', (req, res) => {
    res.render('nguoidung/get-list');
  });

  app.get('/tokhai-step2', (req, res) => {
    res.render('nguoidung/upload_phuluc');
  });


  app.get('/list-phuluc/:id', async (req, res) => {
    const id = req.params.id;
    const phuluc = await Phuluc.findByPk(id);
    const filesArray = phuluc.files || [];
    console.log(phuluc);
    console.log("danh sách các file là",filesArray);
    res.render('phulucDetails', { phuluc, filesArray });
  });

}