const { authJwt, validateInput, checkDateValidity, isOpen, isOpenTochuc } = require("../middleware");
const { deleteUser, getAllUser, update, findOne, getUser, updateCanhan, changePassword, forgotPassword } = require("../controllers/canhan.controller");
const upload = require("../middleware/excelUpload");
const excelController = require("../controllers/excel.controller");
const tokhaithue = require("../controllers/tokhai.controller");
const db = require("../models");
const { getAllToChuc, deleteToChuc, deleteNhanVien, updateNhanvien, getTochuc, deleteMultiple, updateToChuc } = require("../controllers/tochuc.controller");
const { getAllTokhai } = require("../controllers/auth.controller");
const TochucUpload = db.tochuckekhaithue;
const { getTokhaithue, duyettokhai, tokhaikhongduocduyet, checkTokhai, getListThuNhap, getPhuluc, downloadPhuluc, moKyQuyetToan, moKyQuyetToanTochuc, listOpenKyQuyetToan } = require("../controllers/admin.controller");
const Tokhai = db.tokhaithue;
const { uploadTokhai, previewFiles } = require("../controllers/upload.controller");
const Phuluc = db.phuluc;
const Files = db.noptokhai;
const svgCaptcha = require("svg-captcha");
const otpDatabase = new Map();
const { Sequelize } = require('sequelize');
const importController = require("../controllers/import.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.get("/otp", [authJwt.verifyTokenCanhan], (req, res) => {
    res.render("nguoidung/otp");
  })

  app.post("/otp", [authJwt.verifyTokenCanhan], forgotPassword);


  app.post('/validate-otp', (req, res) => {
    const { email, otp } = req.body;
    const storedData = otpDatabase.get(email);
    if (storedData && storedData.otp === otp && Date.now() < storedData.expirationTime) {
      res.render('reset-password-form', { email: email });
    } else {
      req.flash('error', 'Mã OTP không đúng hoặc đã hết hạn.');
      return res.redirect("/");
    }
  });

  app.post('/reset-password', (req, res) => {
    const email = req.body.email;
    const newPassword = req.body.newPassword;
    otpDatabase.delete(email);

    res.send('Password reset successful. You can now log in with your new password.');
  });



  // HOMEPAGE
  app.get('/admin', [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {             // homepage admin
    const user = req.session.user;
    console.log(user);
    res.render('admin/index', { user: user });
  });


  app.get('/tochuc/', [authJwt.verifyTokenTochuc, authJwt.isTochuc], getTochuc);

  app.get('/canhan', [authJwt.verifyTokenCanhan], (req, res) => {                       // homepage cá nhân
    res.render("nguoidung/index.ejs");
  })

  // xem trước file pdf + images
  app.get('/uploads/:filename', previewFiles);

  // captcha
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

  // download files
  app.get('/download', (req, res) => {
    const filePath = req.query.path;
    res.download(filePath);
  });



  // TRUY CẬP QUYỀN ADMIN

  app.get("/create-user", [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
    res.render("admin/create");                                                                 // form create cá nhân
  });

  app.get("/create-tochuc", [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {             // form create tổ chức
    res.render("admin/auth/create.tochuc.ejs");
  });


  app.get("/update/:id", [authJwt.verifyToken, authJwt.isAdmin], findOne);                      // lấy thông tin update cá nhân
  app.get("/deletecn/:id", [authJwt.verifyToken, authJwt.isAdmin], deleteUser);                 // xóa cá nhân
  app.get("/list-user", [authJwt.verifyToken, authJwt.isAdmin], getAllUser);                    // lấy danh sách tất cả người dùng cá nhân
  app.get("/list-dn", [authJwt.verifyToken, authJwt.isAdmin], getAllToChuc);                    // lấy all danh sách doanh nghiệp/tổ chức
  app.get("/delete/:id", [authJwt.verifyToken, authJwt.isAdmin], deleteToChuc);                 // xóa 1 tổ chức/doanh nghiệp
  app.get("/getAll", [authJwt.verifyToken, authJwt.isAdmin], excelController.getAllExcelFile);
  app.get('/tokhaithue/:id', [authJwt.verifyToken, authJwt.isAdmin], getTokhaithue);
  app.get("/duyet-to-khai", [authJwt.verifyToken, authJwt.isAdmin], getAllTokhai);
  app.post("/update/:id", [authJwt.verifyToken, authJwt.isAdmin], update);
  app.get('/download-phuluc/:id', [authJwt.verifyToken, authJwt.isAdmin], downloadPhuluc);
  app.get('/phu-luc-to-khai/:id', [authJwt.verifyToken, authJwt.isAdmin], getPhuluc);
  app.put('/capnhattrangthai/:id', [authJwt.verifyToken, authJwt.isAdmin], duyettokhai);        // duyệt tờ khai
  app.put('/duyet-to-khai/:id', [authJwt.verifyToken, authJwt.isAdmin], tokhaikhongduocduyet);  // từ chối duyệt tờ khai
  app.post('/check-status/:id', [authJwt.verifyToken, authJwt.isAdmin], checkTokhai);
  app.get('/list-de-nghi-hoan-thue', [authJwt.verifyToken, authJwt.isAdmin], tokhaithue.listHoanThue);
  app.post('/list-hoan-tra-thue', [authJwt.verifyToken, authJwt.isAdmin], tokhaithue.exportDanhSachHoanThue);   // xuất danh sách hoàn trả thuế sang excel
  app.get('/hoan-tra-thue/:id', tokhaithue.hoanthueResultAdmin);                                                // truy xuất thông tin hoàn trả thuế thuộc tờ khai
  app.post("/import-canhan", [authJwt.verifyToken, authJwt.isAdmin], upload.single("file"), importController.importCanhan);   // import file excel tạo tài khoản cá nhân

  app.get('/ky-quyet-toan', [authJwt.verifyToken, authJwt.isAdmin],listOpenKyQuyetToan);


  app.get('/mo-ky-quyet-toan', [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
    const user = req.session.user;
    res.render('admin/moKyQuyetToan', { admin: user });
  });

  app.post('/mo-ky-quyet-toan', [authJwt.verifyToken, authJwt.isAdmin], moKyQuyetToan);

  app.post('/mo-ky-quyet-toan-to-chuc', [authJwt.verifyToken, authJwt.isAdmin], moKyQuyetToanTochuc);



  // TRUY CẬP QUYỀN TỔ CHỨC
  app.get('/delete-nv/:id', [authJwt.verifyTokenTochuc, authJwt.isTochuc], deleteNhanVien);
  app.get('/tochuc/update/:id', [authJwt.verifyToken, authJwt.isTochuc], excelController.getTochucUser);              // get one
  app.get('/tochuc/upload', [authJwt.verifyTokenTochuc, authJwt.isTochuc], excelController.getToChucUploadFile);      // get all

  app.post('/update/nv/:id', [authJwt.verifyTokenTochuc, authJwt.isTochuc], updateNhanvien);                                    // select -  xóa nhiều 
  app.post("/upload", [authJwt.verifyTokenTochuc, authJwt.isTochuc, isOpenTochuc], upload.single("file"), excelController.upload); // upload file excel 

  app.get("/tochuc/upload-file", [authJwt.verifyTokenTochuc, authJwt.isTochuc, isOpen], (req, res) => {               // form upload file excel
    const user = req.session.user;
    console.log(user);
    res.render('tochuc/upload', { user: user });
  });

app.get('/tochuc/cap-nhat-thong-tin', (req, res) => {
  res.render('tochuc/update');
});

app.post('/cap-nhat-thong-tin', [authJwt.verifyTokenTochuc, authJwt.isTochuc], updateToChuc);
  app.post('/delete-multiple', async (req, res) => {
    const idsToDelete = req.body.ids;
  
    try {
      const result = await TochucUpload.destroy({
        where: {
          id: { [Sequelize.Op.in]: idsToDelete },
        },
      });
      console.log('Received IDs:', idsToDelete);
      if (result) {
        res.json({ success: true, message: 'Deleted successfully' });
      } else {
        res.json({ success: false, message: 'No records deleted' });
      }
    } catch (error) {
      console.error('Error during deletion:', error);
      res.status(500).json({ success: false, message: 'Error during deletion' });
    }
  });


  // TRUY CẬP QUYỀN CÁ NHÂN

  app.get('/check-is-open-tochuc', isOpen);
  app.get("/edit-profile", [authJwt.verifyTokenCanhan], (req, res) => {             // form update profile
    const user = req.session.user;
    res.render("nguoidung/editProfile", { user });
  });

  app.post("/update-profile/:id", [authJwt.verifyToken], updateCanhan);             // upload profile

  app.get('/tokhaithue', [authJwt.verifyTokenCanhan, isOpenTochuc], getUser);       // tờ khai step 1  
  app.get("/tokhai/b2", [authJwt.verifyTokenCanhan], (req, res) => {                // tờ khai step 2
    res.render('nguoidung/upload_phuluc')                                 
  });

  app.get('/tokhai/b3', [authJwt.verifyTokenCanhan], (req, res) => {                // tờ khai step 3
    res.render('nguoidung/tokhaiB3');
  });
  app.get('/success', [authJwt.verifyTokenCanhan], (req, res) => {                  // thông báo thành công
    const tokhaiData = req.session.tokhaiData;
    res.render('nguoidung/tokhai_success', { tokhaiData });
  });

  app.post('/tokhai/b1', tokhaithue.create);                                        // post step 1
  app.post('/tokhai/b2', [authJwt.verifyTokenCanhan], async (req, res) => {         // post step 2
    await tokhaithue.createTokhaiStep2(req, res);
  });
  app.post('/tokhai/b3', [authJwt.verifyTokenCanhan], async (req, res) => {         // post step 3
    const userCaptcha = req.body.captcha;
    if (userCaptcha !== req.session.captcha) {
      return res.render('nguoidung/tokhaiB3', { captchaError: true, error: 'Mã kiểm tra không chính xác!' });
    }
    await tokhaithue.createTokhaiStep3(req, res);
    res.redirect('/success');
  });



  app.get('/tra-cuu-thu-nhap', [authJwt.verifyTokenCanhan], (req, res) => {         // form tra cứu thu nhập
    res.render('nguoidung/tracuu');
  });

  app.get('/tra-cuu-to-khai', [authJwt.verifyTokenCanhan], (req, res) => {          // form tra cứu tờ khai
    res.render('nguoidung/tra-cuu-to-khai');
  });

  app.get('/tra-cuu-to-khai-result', [authJwt.verifyTokenCanhan], (req, res) => {   // kết quả tra cứu tờ khai
    res.render('/nguoidung/resultsSearch');
  });

  app.post('/tra-cuu-to-khai-qtt', validateInput, checkDateValidity, tokhaithue.tracuuTokhai, (req, res) => {
    const { searchResult } = res.locals;
    res.render('nguoidung/resultsSearch', { searchResult });
  });

  app.get('/add-phu-luc/:id', [authJwt.verifyTokenCanhan], async (req, res) => {          // form thêm phụ lục tờ khai ở phần tra cứu tờ khai
    const id = req.params.id;
    console.log("id là: ", id);
    res.render('nguoidung/addPhuluc', { id });
  });

  app.post('/add-phu-luc/:id', [authJwt.verifyTokenCanhan], tokhaithue.createPhuluc);     // tạo phụ lục tờ khai

  app.get('/thong-tin-hoan-tra-thue/:id', tokhaithue.hoanthueResult);                     // thông tin hoàn trả thuế

  app.get('/list-thu-nhap', [authJwt.verifyTokenCanhan], (req, res) => {
    const data = req.session.tochuckekhaithue || [];
    res.render('nguoidung/tong-thu-nhap', { tochuckekhaithue: data });
  });

  app.post('/tra-cuu-thu-nhap', [authJwt.verifyTokenCanhan], async (req, res) => {        // tìm kiếm thông tin thu nhập
    try {
      // kiểm tra mã captcha
      const userCaptcha = req.body.captcha;
      if (userCaptcha !== req.session.captcha) {
        return res.render('nguoidung/tracuu', { captchaError: true, error: 'Mã kiểm tra không chính xác!' });
      }

      const tochuckekhaithue = await getListThuNhap(req, res);

      if (tochuckekhaithue === null) {
        return res.render('nguoidung/tracuu', { noDataError: true, error: 'Không tìm thấy thông tin thu nhập!' });
      }

      req.session.tochuckekhaithue = tochuckekhaithue;
      if (tochuckekhaithue) {
        return res.redirect(`/list-thu-nhap?result`);
      }
      else {
        return res.render('nguoidung/tracuu', { noDataError: true, error: 'Không tìm thấy thông tin thu nhập!' });
      }

    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.post('/update-bank/:id', tokhaithue.updateBank);                                    // thêm thông tin tài khoản ngân hàng






  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  app.get('/list-file-upload', [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
    Files.findAll().then(files => {
      res.render('admin/listFileUpload', { files });
    });
  });

  app.get('/noptokhai', (req, res) => {
    Files.findAll().then(files => {
      res.render('nguoidung/guitokhai', { files });
    });
  });
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
}