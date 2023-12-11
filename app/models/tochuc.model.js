module.exports = (sequelize, Sequelize) => {
    const Tochuc = sequelize.define("to_chuc", {
      masothue: {
        type: Sequelize.STRING,
        allowNull: false, 
        validate: {
          notEmpty: {
            msg: "Ma so thue khong duoc de trong!"
          }
        }
      },
  
      tentochuc: {
        type: Sequelize.STRING,
        allowNull: false
      },
  
      daidien: {
        type: Sequelize.STRING,
       // allowNull: false,
      //  validate: {
       //   notEmpty: {
        //    msg: "Ten dai dien khong duoc de trong!"
       //   }
       // }
      },

      address: {
        type: Sequelize.STRING,
         
      },

      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "So dien thoai khong duoc de trong!"
          }
        }
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false, 
        validate: {
          notEmpty: {
            msg: "Email khong duoc de trong!"
          }
        }
      },
      cqqtthue: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Co quan quyet toan thue khong duoc de trong!"
          }
        }
      },
      
      nhanvien: {
        type: Sequelize.INTEGER,
       /* allowNull: false,
        validate: {
          notEmpty: {
            msg: "So luong nhan vien khong duoc de trong!"
           }
        }*/
      },
      status: {
        type: Sequelize.STRING,
      },

      linhvuc: {
        type: Sequelize.STRING,
      },

    });
    return Tochuc;
  };
  