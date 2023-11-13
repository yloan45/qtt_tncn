const db = require("../models");
const Tokhai = db.tokhaithue;
const Loaitokhai = db.loaitokhai;
const Hoantrathue = db.hoantrathue;
const Phuluc = db.phuluc;
const File = db.file;
const { uploadPhuluc } = require("../controllers/upload.controller");

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

   

    if (req.body.stk && req.body.nganhang) {
        await Hoantrathue.create(hoantrathue);
    }

    console.log(tokhai);
    res.redirect('/success')
}

module.exports = {
    create: createTokhai
}