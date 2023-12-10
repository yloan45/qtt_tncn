const express = require('express');
const { getAllToChuc, deleteToChuc } = require('../controllers/tochuc.controller');
const { authJwt } = require('../middleware');

const router = express.Router();

// public content
router.get('/', (req, res) => {
    res.render('index')
});


// ADMIN
router.get('/admin-login', (req, res) => {
  res.render('admin/auth/login.ejs')
});

// CÁ NHÂN 

router.get('/nd-register', (req, res) => {
    res.render('nguoidung/register')
});
router.get('/homepage', (req, res) => {
  res.render('nguoidung/homepage.ejs')
});




// TỔ CHỨC - DOANH NGHIỆP



module.exports = router;