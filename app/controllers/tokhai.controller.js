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
const { Op } = require('sequelize')
const flash = require('express-flash');
const ExcelJS = require('exceljs');
const mailer = require('../utils/mailer');
const Diachi = db.diachi;
const Tochuc = db.tochuc;
const ExcelUpload = db.tochuckekhaithue;
const Bank = db.bank;

const createTokhai = async (req, res) => {
  const loaitokhai = await Loaitokhai.findOne({
    where: {
      tenloai: 'Tờ khai chính thức'
    }
  });
  const tokhaiData = {
    fullname: req.body.fullname,
    email: req.body.email,
    dienthoai: req.body.dienthoai,
    address: (req.body.xa_phuong || '') + ', ' + (req.body.quan_huyen || '') + ', ' + (req.body.tinh_tp || ''),
    namkekhai: req.body.year,
    tokhai: req.body.tokhai,
    stk: req.body.stk,
    nganhang: req.body.nganhang,
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
    console.log("dữ liệu nhập vào là: " + phulucData);
    const tokhai = await Tokhai.create(tokhaiData);
    const ct46 = parseFloat(tokhai.ct46);
    const hoantrathue = {
      tonghoantra: tokhai.ct46,
      trangthai: ct46 > 0 ? "đề nghị hoàn trả thuế" : "không đề nghị hoàn trả thuế",
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

    if(tokhai){
      mailer.sendMail(tokhaiData.email, "Tờ khai quyết toán đã được tạo",
      `Xin chào ${tokhaiData.fullname}, <br> 
      Tờ khai quyết toán của bạn đã được ghi nhận.<br>
      Vui lòng theo kiểm tra lại email sau 3 ngày làm việc.
      `)
    }
    delete req.session.tokhaiData;
    delete req.session.phulucData;
    // res.redirect('/success');
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

/*
const tracuuTokhai = async (req, res) => {
  try{
    const {tokhai, trangthaixuly, startDate, endDate} = req.body;
    if (!tokhai || !trangthaixuly || !startDate || !endDate) {
      req.flash('error','Vui lòng nhập đầy đủ thông tin để tra cứu!');
      return res.redirect('/tra-cuu-to-khai');
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
        },
        {
          model: Hoantrathue, as: 'hoan_tra_thue'
        }
      ]
    });
    console.log("kết quả tra cứu là: ",searchResult);
    res.render('nguoidung/resultsSearch', {searchResult});
    
  } catch {

  } 

};
*/
async function createPhuluc(req, res) {
  try {
    uploadPhuluc(req, res, async (err) => {
      if (err) {
        console.error(err);
        if (err.code === 'LIMIT_FILE_SIZE') {
          const errorMessage = 'Dung lượng file không được vượt quá 5MB';
          return res.send(`<script>alert('${errorMessage}'); window.location.href = window.location.href;</script>`);
        }
        return res.status(500).send(err.message);
      }
      const isImageOrPDF = req.files.every(file =>
        file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf'
      );

      if (!isImageOrPDF) {
        const errorMessage = 'Loại file không hợp lệ. Vui lòng chọn file ảnh hoặc PDF.';
        return res.send(`<script>alert('${errorMessage}'); window.location.href = window.location.href;</script>`);
      }

      const phulucData = {
        tenphuluc: req.body.fieldName[0],
        files: req.files.map((file, index) => ({
          filename: file.filename,
          filePath: file.path,
          fieldName: req.body.fieldName[index]
        }))
      };

      const id = req.params.id;
      console.log("id của tờ khai là: ", id);
      const tokhai = await Tokhai.findByPk(id);


      if (!tokhai) {
        return res.status(404).send('Tờ khai không tồn tại');
      }
      const existingPhuluc = await Phuluc.findOne({
        where: {
          toKhaiThueId: tokhai.id,
        },
      });

      if (!existingPhuluc) {
        return res.status(404).send('Phụ lục không tồn tại cho tờ khai này');
      }
      const newFilesData = phulucData.files.map((file) => ({
        filename: file.filename,
        filePath: file.filePath,
        fieldName: file.fieldName,
        phuLucId: existingPhuluc.id,
      }));
      await File.bulkCreate(newFilesData);
      res.send(`<script>alert('Thêm phụ lục thành công! Tờ khai đã được cập nhật'); window.location.href = window.location.href;</script>`);
    //  res.redirect('/tra-cuu-to-khai');

    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

const tracuuTokhai = async (req, res, next) => {
  try {
    const user = req.session.user;

    const { trangthaixuly, startDate, endDate } = req.body;
    const startDatetime = new Date(startDate + 'T00:00:00Z');
    const endDatetime = new Date(endDate + 'T23:59:59Z');

    const searchResult = await Tokhai.findAll({
      where: {
        caNhanId: user.caNhanId,
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
        },
        {
          model: Hoantrathue, as: 'hoan_tra_thue'
        }
      ]
    });

    console.log('Kết quả tra cứu là: ', searchResult);

    res.locals.searchResult = searchResult;
    next();

  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};


const hoanTraThue = async (id) => {
  try {
    const hoanTraThue = await Tokhai.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Hoantrathue, as: 'hoan_tra_thue'
        },
        {
          model: Canhan, as: 'ca_nhan'
        }
      ]
    });

    if (hoanTraThue && hoanTraThue.hoan_tra_thue) {
      const thongTinHoanTraThue = hoanTraThue.hoan_tra_thue;
      return { thongTinHoanTraThue, tokhai: hoanTraThue, id };
    } else {
      console.log("Không có thông tin hoàn trả thuế");
      return null;
    }
  } catch (error) {
    throw error;
  }
};


const hoanthueResult = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await hoanTraThue(id);
    
    if (result) {
      const { thongTinHoanTraThue, tokhai, id } = result;
      res.render('nguoidung/hoanTraThue', { thongTinHoanTraThue, tokhai, id });
    } else {
      console.log("Không có thông tin hoàn trả thuế");
    }

  } catch (error) {
    throw error;
  }
}

const hoanthueResultAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await hoanTraThue(id);
    if (result) {
      const { thongTinHoanTraThue, tokhai, id } = result;
      res.render('admin/hoanTraThue', { thongTinHoanTraThue, tokhai, id });
    } else {
      console.log("Không có thông tin hoàn trả thuế");
    }

  } catch (error) {
    throw error;
  }
}

const updateBank = async (req, res) => {
  try {
    const id = req.params.id;
    const { stk, nganhang } = req.body;
    const tokhai = await Tokhai.findByPk(id);

    if (!tokhai) {
      return res.status(404).send('Tờ khai không tồn tại');
    }

    await tokhai.update({
      stk: stk,
      nganhang: nganhang,
    });

    res.status(200).redirect(`/thong-tin-hoan-tra-thue/${id}?success=true`);


  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const listHoanThue = async (req, res) => {
  try {
    const listHoanThue = await Hoantrathue.findAll({
      where: {
        trangthai: "đề nghị hoàn trả thuế"
      },
      include: [
        {
          model: Tokhai, as: 'to_khai_thue',
          include: [
            {
              model: Canhan, as: 'ca_nhan'
            }
          ]
        },
      ]
    });
    if (!listHoanThue) {
      res.status(404).send("Not Found");
    }
  
    console.log("danh sách cá nhân đề nghị hoàn trả thuế: " + listHoanThue);
    res.render("admin/listHoanThue", { hoantrathue: listHoanThue });
  } catch (error) {
    throw error;
  }
};

const exportDanhSachHoanThue = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('HoanThue');

    const listHoanThue = await Hoantrathue.findAll({
      where: {
        trangthai: "đề nghị hoàn trả thuế"
      },
      include: [
        {
          model: Tokhai, as: 'to_khai_thue',
          include: [
            {
              model: Canhan, as: 'ca_nhan'
            }
          ]
        },
      ]
    });

    worksheet.columns = [
      { header: 'STT', key: 'stt', width: 5 },
      { header: 'Tên NNT', key: 'fullname', width: 25 },
      { header: 'Mã số thuế', key: 'masothue', width: 25 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Điện thoại', key: 'dienthoai', width: 25 },
      { header: 'Kỳ quyết toán', key: 'namkekhai', width: 25 },
      {
        header: 'Số thuế nộp thừa trong kỳ', key: 'ct44', width: 25,
        style: {
          alignment: { wrapText: true }
        }
      },
      {
        header: 'Số thuế đề nghị hoàn trả vào tài khoản', key: 'ct46', width: 25,
        style: {
          alignment: { wrapText: true }
        }
      },
      { header: 'Ngân hàng', key: 'nganhang', width: 25},
      { header: 'Số tài khoản', key: 'stk' , width: 25},
    ];
    listHoanThue.forEach((hoanthue, index) => {
      const rowData = {
        stt: index + 1,
        fullname: hoanthue.to_khai_thue.fullname,
        masothue: hoanthue.to_khai_thue.ca_nhan.masothue,
        email: hoanthue.to_khai_thue.ca_nhan.email,
        dienthoai: hoanthue.to_khai_thue.ca_nhan.phone,
        namkekhai: hoanthue.to_khai_thue.namkekhai,
        ct44: hoanthue.to_khai_thue.ct44,
        ct46: hoanthue.tonghoantra,
        nganhang: hoanthue.to_khai_thue.nganhang,
        stk: hoanthue.to_khai_thue.stk
      };

    worksheet.addRow(rowData);

    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=hoan_thue.xlsx');

  await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).send("Internal Server Error");
  }
};

const exportUser = async (req, res) => {
  try {
    const canhanData = await Canhan.findAll({
      where: {
        status: null
      }, 
      include: [
        {
          model: Diachi, as: 'dia_chi',
          attributes: ['tinh_tp', 'quan_huyen', 'xa_phuong']
        }
      ]
    });

    const plainData = canhanData.map((instance) => instance.get({ plain: true }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('CaNhanData');

    worksheet.columns = [
      { header: 'Mã số thuế', key: 'masothue', width: 15 },
      { header: 'Họ và tên', key: 'fullname', width: 20 },
      { header: 'CCCD', key: 'cccd', width: 15 },
      { header: 'Điện thoại', key: 'phone', width: 15 },
      { header: 'Phụ thuộc', key: 'phuthuoc', width: 10 },
      { header: 'Email', key: 'email', width: 20 },
      { header: 'Cơ quan quyết toán thuế', key: 'cqqtthue', width: 25 },
      { header: 'Địa chỉ', key: 'dia_chi', width: 25 },
    ];

    plainData.forEach((row) => {
      worksheet.addRow(row);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=ca_nhan_data.xlsx');

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.error('Error exporting data to Excel:', error);
    res.status(500).send('Internal Server Error');
  }
};

const exportTochuc = async (req, res) => {
  try {
    const tochuc = await Tochuc.findAll();

    const plainData = tochuc.map((instance) => instance.get({ plain: true }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('tochuc');

    worksheet.columns = [
      { header: 'Mã số thuế', key: 'masothue', width: 15 },
      { header: 'Tên đơn vị', key: 'tentochuc', width: 25 },
      { header: 'Đại diện', key: 'daidien', width: 20 },
      { header: 'Điện thoại', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Cơ quan quyết toán thuế', key: 'cqqtthue', width: 30 },
      { header: 'Số lượng nhân viên', key: 'nhanvien', width: 15 },
      { header: 'Địa chỉ', key: 'dia_chi', width: 35 },
    ];

    plainData.forEach((row) => {
      worksheet.addRow(row);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=list-to-chuc.xlsx');

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.error('Error exporting data to Excel:', error);
    res.status(500).send('Internal Server Error');
  }
};

const exportThunhap = async (req, res) => {
  try {
    const excelData = await ExcelUpload.findAll({
      include: [{ model: Tochuc, as: "to_chuc",attributes: ['tentochuc'] }],
    });

    const plainData = excelData.map((instance) => {
      const plainInstance = instance.get({ plain: true });
      const tentochuc = plainInstance.to_chuc ? plainInstance.to_chuc.tentochuc : '';
      return {
        masothue: plainInstance.masothue,
        tentochuc: tentochuc,
        hoten: plainInstance.hoten,
        dienthoai: plainInstance.dienthoai,
        email: plainInstance.email,
        diachi: plainInstance.diachi,
        thunhaptinhthue: plainInstance.thunhaptinhthue,
        ghichu: plainInstance.ghichu,
      };
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('tochuc');

    worksheet.columns = [
      { header: 'Mã số thuế', key: 'masothue', width: 15 },
      { header: 'Tên đơn vị', key: 'tentochuc', width: 25 },
      { header: 'Tên NLĐ', key: 'hoten', width: 20 },
      { header: 'Điện thoại', key: 'dienthoai', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Địa chỉ', key: 'diachi', width: 30 },
      { header: 'Tổng thu nhập', key: 'thunhaptinhthue', width: 35 },
      { header: 'Ghi chú', key: 'ghichu', width: 15 },
    ];

    plainData.forEach((row) => {
      worksheet.addRow(row);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=list-to-chuc.xlsx');

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.error('Error exporting data to Excel:', error);
    res.status(500).send('Internal Server Error');
  }
};


const deleteTokhai = async (req, res) => {
  try {
    const id = req.params.id;
    const tokhai = await Tokhai.findOne({
      where: {
        id: id,
      },
      include: [{
        model: Trangthai, 
        as: 'trang_thai_xu_li',
      }]
    })

    if(tokhai.trangThaiXuLiId === 1){
      Tokhai.destroy({
        where: {
          id: id,
        }
      });
      return res.send(`<script>alert('Xóa thành công!'); window.history.back();</script>`);
    } else {
      return res.send(`<script>alert('Xóa không thành công!');  window.history.back();</script>`);
    }
    
  } catch (error) {
    throw error;
  }
};

module.exports = {
  create: createTokhai,
  createTokhaiStep2,
  createTokhaiStep3,
  tracuuTokhai,
  createPhuluc,
  hoanTraThue, updateBank, hoanthueResult,
  hoanthueResultAdmin, listHoanThue,
  exportDanhSachHoanThue, exportUser, exportTochuc, exportThunhap,
  deleteTokhai
};