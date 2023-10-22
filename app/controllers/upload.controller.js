const db = require("../models");
const express = require('express');

const multer = require('multer');

const path = require('path');
const File = db.file;


// Cấu hình Multer để lưu tệp tải lên vào thư mục 'public/uploads'
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const uploadTokhai = multer({ storage });
module.exports = uploadTokhai;
