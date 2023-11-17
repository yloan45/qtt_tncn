const db = require("../models");
const Tokhai = db.tokhaithue;
const Loaitokhai = db.loaitokhai;
const Hoantrathue = db.hoantrathue;
const Phuluc = db.phuluc;
const File = db.file;
const Duyettokhai = db.duyettokhai;
const Canhan = db.canhan;
const { uploadPhuluc } = require("../controllers/upload.controller");
const Trangthai = db.trangthaixuly;
const {Op} = require('sequelize')

const createTokhai = async (req, res) => {
  const loaitokhai = await Loaitokhai.findOne({
    where: {
      tenloai: 'Tờ khai chính thức'
    }
  });
  const tokhaiData = {
    fullname: req.body.fullname,
    address: (req.body.xa_phuong || '') + ', ' + (req.body.quan_huyen || '') + ', ' + (req.body.tinh_tp || ''),
    // dienthoai: req.body.phone,
    // masothue: req.body.masothue,
    // email: req.body.email,
    namkekhai: req.body.year,
    tokhai: req.body.tokhai,
    stk: req.body.stk,
    nganhang: req.body.nganhang,
    // loaitokhai: req.body.loaitokhai,
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
  };
  
  req.session.tokhaiData = tokhaiData;
  res.redirect('/tokhai/b2');
}

/*async function createTokhaiStep2(req, res, tokhaiData) {
    try {
      const tokhai = await Tokhai.create(tokhaiData);
        const ct46 = tokhai;

        const hoantrathue = {
          tonghoantra: tokhai.ct46,
          trangthai: "đang xét duyệt",
          toKhaiThueId: tokhai.id
        }
        const hoantra = Hoantrathue.create(hoantrathue);


      uploadPhuluc(req, res, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send(err.message);
        }
        const phulucData = {
          tenphuluc: req.body.fieldName[0], // lấy tên trường đầu tiên của phụ lục
          toKhaiThueId: tokhai.id,
        };
  
        const phuluc = await Phuluc.create(phulucData);
  
        const filesData = req.files.map((file, index) => ({
          filename: file.filename,
          filePath: file.path,
          fieldName: req.body.fieldName[index],
          phuLucId: phuluc.id,
        }));
  
        await File.bulkCreate(filesData);
  
        delete req.session.tokhaiData;
        res.redirect('/success');
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
}*/


async function createTokhaiStep2(req, res) {
  try {

    uploadPhuluc(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err.message);
      }
      const phulucData = {
        tenphuluc: req.body.fieldName[0],
        files: req.files.map((file, index) => ({
          filename: file.filename,
          filePath: file.path,
          fieldName: req.body.fieldName[index]
        }))
      };
      req.session.phulucData = phulucData;
      res.redirect('/tokhai/b3');
    });

  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

async function createTokhaiStep3(req, res) {
  try {
    const phulucData = req.session.phulucData;
    const tokhaiData = req.session.tokhaiData;
    console.log("đữ liệu nhập vào là: " + phulucData);
    const tokhai = await Tokhai.create(tokhaiData);
    const ct46 = tokhai;

    const hoantrathue = {
      tonghoantra: tokhai.ct46,
      trangthai: "đang xét duyệt",
      toKhaiThueId: tokhai.id,
    };
    const hoantra = await Hoantrathue.create(hoantrathue);

    await new Promise((resolve, reject) => {
      uploadPhuluc(req, res, async (err) => {
        if (err) {
          console.error(err);
          reject(err);
          return res.status(500).send(err.message);
        }

        const phuluc = await Phuluc.create({
          tenphuluc: phulucData.tenphuluc,
          toKhaiThueId: tokhai.id,
        });

        const filesData = phulucData.files.map((file) => ({
          filename: file.filename,
          filePath: file.filePath,
          fieldName: file.fieldName,
          phuLucId: phuluc.id,
        }));

        await File.bulkCreate(filesData);
        resolve();
      });
    });
    
    delete req.session.tokhaiData;
    delete req.session.phulucData;
   // res.redirect('/success');
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}


const tracuuTokhai = async (req, res) => {
  try{
    const {tokhai, trangthaixuly, startDate, endDate} = req.body;
    if (!tokhai || !trangthaixuly || !startDate) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin để tra cứu' });
    }
    
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);  // cộng thêm 1 ngày
    const startDatetime = new Date(startDate + 'T00:00:00Z');
    const endDatetime = new Date(endDate+ 'T23:59:59Z');


    if(startDatetime >= currentDate){
      return res.render('nguoidung/tra-cuu-to-khai', { startError: true, startError: 'Ngày gửi không được quá ngày hiện tại!' });
    } 
     if(endDatetime < startDatetime){
      return res.render('nguoidung/tra-cuu-to-khai', { endError: true, endError: 'Ngày kết thúc không được ít hơn  ngày hiện tại!' });
    }


    const searchResult = await Tokhai.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDatetime, endDatetime],
        },
      },
      include: [
        {
          model: Trangthai, as: 'trang_thai_xu_li',
          where: {
            tentrangthai: trangthaixuly
          }
        },
        {
          model: Loaitokhai, as: 'loai_to_khai'
        },
        {
          model: Canhan, as: 'ca_nhan'
        }
      ]
    });
    console.log("kết quả tra cứu là: ",searchResult);
    res.render('nguoidung/resultsSearch', {searchResult});
    
  } catch {

  } 

};

module.exports = {
  create: createTokhai,
  createTokhaiStep2,
  createTokhaiStep3,
  tracuuTokhai
};