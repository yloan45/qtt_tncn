const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Tokhai = db.tokhaithue;
const Op = db.Sequelize.Op;
const Loaitokhai = db.loaitokhai;
const Trangthaixuli = db.trangthaixuly;
const Hoantrathue = db.hoantrathue;
const Phuluc = db.phuluc;
const File = db.file;
const { uploadTokhai, uploadPhuluc} = require("../controllers/upload.controller");
// create tờ khai quyết toán thuế thu nhập cá nhân

const createTokhai = async (req, res) => {
    const loaitokhai = await Loaitokhai.findOne({
        where: {
            tenloai: 'Tờ khai chính thức'
        }
    });
    
    const tokhai = await Tokhai.create({
        fullname: req.body.fullname,
        address: req.body.address,
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
    });

    const hoantrathue = {
      stk: req.body.stk,
      nganhang: req.body.nganhang,
      toKhaiThueId: tokhai.id
    };
/*
    uploadPhuluc(req, res, async (err) => {
        if (err) {
            // Xử lý lỗi tải lên file
            console.error(err);
            return res.status(500).send(err.message);
        }
        // Khi tải lên file hoàn tất, tiến hành tạo Phuluc
        try {
            const phulucData = {
                tenphuluc: req.body.fieldName,
                files: [] // Tạo một mảng để lưu thông tin về các file
            };
            req.files.forEach((file) => {
                phulucData.files.push({
                    filename: file.filename,
                    filepath: file.path
                });
            });
            const phuluc = await Phuluc.create(phulucData);

        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    });
    
*/
uploadPhuluc(req, res, async (err) => {
    if (err) {
        console.error(err);
        return res.status(500).send(err.message);
    }
    // Khi tải lên file hoàn tất, tiến hành tạo Phuluc
    try {
        // Trong hàm createTokhai
const phuluc = await Phuluc.create({
    tenphuluc: req.body.fieldName[0], // Lấy tên phụ lục từ trường đầu tiên
    toKhaiThueId: tokhai.id,
});

const filesData = req.files.map((file, index) => ({
    filename: file.filename,
    filePath: file.path,
    fieldName: req.body.fieldName[index],
    phuLucId: phuluc.id, // Liên kết với Phuluc vừa tạo
}));

await File.bulkCreate(filesData);


        // Tiếp tục xử lý...
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

    if(req.body.stk && req.body.nganhang){
     await Hoantrathue.create(hoantrathue);
    }

    console.log(tokhai);
    res.redirect('/success')
}

const getFilesFromDatabase = async (phulucId) => {
    try {
        const phuluc = await Phuluc.findByPk(phulucId, { attributes: ['id', 'tenphuluc'], raw: true });

        if (!phuluc) {
            return null; // Handle the case where the specified phulucId is not found
        }

        const files = await Phuluc.findAll({ where: { phulucId: phuluc.id }, raw: true });

        return {
            phuluc: phuluc,
            filesArray: files,
        };
    } catch (error) {
        console.error('Error fetching files from the database:', error);
        throw error;
    }
};

// tokhai.controller.js
const getPhulucDetails = (req, res) => {
    // Fetch 'files' from your database based on the 'phulucId' or other criteria
    const filesArray = getFilesFromDatabase(req.params.phulucId); // Implement this function
    console.log(filesArray);
    res.render('phulucDetails', { filesArray });
};

module.exports = {
    create: createTokhai,
    getPhulucDetails,
    getFilesFromDatabase
}