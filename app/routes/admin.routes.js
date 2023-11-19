const express = require('express');
const { getAllExcelFile } = require('../controllers/excel.controller');
const { authJwt } = require('../middleware');
const { findOne, deleteUser, getAllUser, update } = require('../controllers/canhan.controller');
const { getAllToChuc, deleteToChuc } = require('../controllers/tochuc.controller');
const router = express.Router();

router.get('/to-chuc-ke-khai', getAllExcelFile);
router.get("/update/:id", [authJwt.verifyToken, authJwt.isAdmin],findOne);         // lấy thông tin update cá nhân
router.get("/deletecn/:id",[authJwt.verifyToken, authJwt.isAdmin], deleteUser);    // xóa cá nhân
router.get("list-user",[authJwt.verifyToken,authJwt.isAdmin], getAllUser);        // lấy danh sách tất cả người dùng cá nhân
router.get("list-dn",[authJwt.verifyToken, authJwt.isAdmin], getAllToChuc);       // lấy all danh sách doanh nghiệp/tổ chức
router.post("/update/:id", [authJwt.verifyToken, authJwt.isAdmin],update);         // update cá nhân
router.get("/delete/:id",[authJwt.verifyToken, authJwt.isAdmin], deleteToChuc);    // xóa 1 tổ chức/doanh nghiệp
                  

module.exports = router;
