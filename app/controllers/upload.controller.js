const db = require("../models");
const multer = require('multer');
const path = require('path');

// Cấu hình Multer để lưu tệp tải lên vào thư mục 'public/uploads'
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const uploadTokhai = multer({ storage });
const uploadPhuluc = multer({ storage }).array('filename', 25); // Cho phep upload toi da 25 tep tin

module.exports = {
    uploadTokhai, uploadPhuluc
};
