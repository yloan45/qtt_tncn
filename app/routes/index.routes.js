const express = require('express');
const router = express.Router();
// test
router.get('/', (req, res) => {
    res.render('index')
});

router.get('/demo', (req, res) => {
  res.render('demo')
});

router.get('/nguoidung', (req, res) => {
    res.render('nguoidung/index')
});

router.get('/nd-login', (req, res) => {
    res.render('nguoidung/login')
});

router.get('/nd-register', (req, res) => {
    res.render('nguoidung/register')
});


router.get('/doanhnghiep', (req, res) => {
    res.render('doanhnghiep/index')
});

router.get('/admin', (req, res) => {
    res.render('admin/index.ejs')
});

router.get('/admin-login', (req, res) => {
  res.render('admin/auth/login.ejs')
});

router.get('/homepage', (req, res) => {
  res.render('nguoidung/homepage.ejs')
});

router.get('/admin-homepage', (req, res) => {
  res.render('admin/homepage.ejs')
});

router.get('/tokhaithue', (req, res) => {
  res.render('nguoidung/tokhaithue.ejs')
});

router.get('/login-2', (req, res) => {
  res.render('nguoidung/login-next.ejs')
});

router.get('/thongtintokhai', (req, res) => {
  res.render('nguoidung/thongtintokhai.ejs')
});

router.get('/dulieutokhai', (req, res) => {
  res.render('nguoidung/dulieutokhai.ejs')
});


router.get('/register-2', (req, res) => {
  res.render('nguoidung/register-next.ejs')
});


router.get('/guitokhai', (req, res) => {
  res.render('nguoidung/guitokhai.ejs')
})

module.exports = router;