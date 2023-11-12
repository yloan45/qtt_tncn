const db = require("../models");
const multer = require('multer');
const path = require('path');
const Noptokhai = db.noptokhai;

// Cấu hình Multer để lưu tệp tải lên vào thư mục 'public/uploads'
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const uploadTokhai = multer({ storage });
//const uploadPhuluc = multer({ storage }).single('filename');
const uploadPhuluc = multer({ storage }).array('filename', 5); // Giả sử bạn cho phép tối đa 5 tệp tin

module.exports = {
    uploadTokhai, uploadPhuluc
};
