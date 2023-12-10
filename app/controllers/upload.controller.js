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

const fileFilter = function (req, file, cb) {
    const id = req.params.id;
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        req.fileValidationError = 'Loại file không hợp lệ. Vui lòng chọn file ảnh hoặc PDF.';
        cb(null, false);
    }
};

const uploadPhuluc = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }
}).array('filename');                                  // Cho phep upload toi da 25 tep tin



const previewFiles = (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../public/uploads/', filename);
    res.sendFile(filePath);
};



module.exports = {
    uploadTokhai, uploadPhuluc,
    previewFiles
};
