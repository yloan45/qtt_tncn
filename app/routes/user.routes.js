const { authJwt } = require("../middleware");
const {  deleteUser, getAllUser, update, findOne, getUser} = require("../controllers/canhan.controller");
const upload = require("../middleware/excelUpload");
const excelController = require("../controllers/excel.controller");
const tokhaithue = require("../controllers/tokhai.controller");
const db = require("../models");
const { getAllToChuc, deleteToChuc, deleteNhanVien, updateNhanvien } = require("../controllers/tochuc.controller");
const { getAllTokhai } = require("../controllers/auth.controller");
const File = db.file; // nhầm lẫn giữa file phụ lục và file nộp tờ khai
const {getTokhaithue, duyettokhai, tokhaikhongduocduyet, checkTokhai, getListThuNhap} = require("../controllers/admin.controller");
const path = require('path');
const {uploadTokhai } = require("../controllers/upload.controller");
const Phuluc = db.phuluc;
const Files = db.noptokhai;
const svgCaptcha = require("svg-captcha");

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
  app.get('/delete-nv/:id', [authJwt.verifyTokenTochuc, authJwt.isTochuc], deleteNhanVien);
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
    Files.findAll().then(files => {
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

// routes
app.get("/captcha", function (req, res) {
  const captcha = svgCaptcha.create({
    noise: 2,
    fontSize: 50,
    color: true,
    
  });
  req.session.captcha = captcha.text;
  res.type('svg');
  res.status(200).send(captcha.data);
  console.log(captcha.text);
});


app.post("/upload", upload.single("file"), excelController.upload);


// nộp tờ khai quyết toán thuế nhu nhập cá nhân
app.get('/noptokhai', (req, res) => {
    Files.findAll().then(files => {
      res.render('nguoidung/guitokhai', { files });
    });
  })

// TẠO TỜ KHAI QUYẾT TOÁN THUẾ

app.get('/tokhaithue',[authJwt.verifyTokenCanhan], getUser);          // step 1  
app.post('/tokhai/b1', tokhaithue.create);                      // post step 1

app.get("/tokhai/b2",[authJwt.verifyTokenCanhan], (req, res)=>{
  res.render('nguoidung/upload_phuluc')                               // get step 2
});
app.post('/tokhai/b2', [authJwt.verifyTokenCanhan], async (req, res) => {                          // post step 2
  await tokhaithue.createTokhaiStep2(req, res);
});

app.get('/tokhai/b3',  [authJwt.verifyTokenCanhan], (req, res) => {
  res.render('nguoidung/tokhaiB3');
});
app.post('/tokhai/b3' , [authJwt.verifyTokenCanhan], async (req, res) => {
  const userCaptcha = req.body.captcha;
  if (userCaptcha !== req.session.captcha) {
     return res.render('nguoidung/tokhaiB3', { captchaError: true, error: 'Mã kiểm tra không chính xác!' });
  }
  await tokhaithue.createTokhaiStep3(req, res);
  res.redirect('/success');
});
app.get('/success', [authJwt.verifyTokenCanhan], ( req, res) => {
  const tokhaiData = req.session.tokhaiData;
  res.render('nguoidung/tokhai_success', {tokhaiData});
});


// Xử lý việc tải lên tệp  => cập nhật lại sau, 
app.post('/noptokhai', uploadTokhai.single('filename'), (req, res) => {
  Files.create({
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


  app.get('/list-thu-nhap', [authJwt.verifyTokenCanhan], (req, res) => {
    const data = req.session.tochuckekhaithue || [];
    res.render('nguoidung/tong-thu-nhap', {tochuckekhaithue: data});
  });

  app.post('/tra-cuu-thu-nhap',[authJwt.verifyTokenCanhan], async (req, res) => {
    try{
      // kiểm tra mã captcha
      const userCaptcha = req.body.captcha;
      if (userCaptcha !== req.session.captcha) {
         return res.render('nguoidung/tracuu', { captchaError: true, error: 'Mã kiểm tra không chính xác!' });
      }

      const tochuckekhaithue = await getListThuNhap(req,res);

      if(tochuckekhaithue === null){
        return res.render('nguoidung/tracuu', { noDataError: true, error: 'Không tìm thấy thông tin thu nhập!' });
      }

      req.session.tochuckekhaithue = tochuckekhaithue;
      if(tochuckekhaithue){
        return res.redirect(`/list-thu-nhap?result`);
      }
      else {
        return res.render('nguoidung/tracuu', { noDataError: true, error: 'Không tìm thấy thông tin thu nhập!' });
      }

    } catch(error){
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/tra-cuu-thu-nhap', [authJwt.verifyTokenCanhan], (req, res) => {
    res.render('nguoidung/tracuu.ejs');
  });


  app.post('/update/nv/:id', [authJwt.verifyTokenTochuc, authJwt.isTochuc] ,updateNhanvien);

  app.get('/tra-cuu-to-khai',[authJwt.verifyTokenCanhan], (req, res) => {
    res.render('nguoidung/tra-cuu-to-khai');
  })
  app.get('/tra-cuu-to-khai-result',[authJwt.verifyTokenCanhan], (req, res) => {
    res.render('/nguoidung/resultsSearch');
  })
  app.post('/tra-cuu-to-khai-qtt',[authJwt.verifyTokenCanhan], tokhaithue.tracuuTokhai);

  app.get('/add-phu-luc/:id', (req, res) => {
    res.render('nguoidung/addPhuluc')
  });
}