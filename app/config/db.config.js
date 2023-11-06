module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "quyet_toan_thue_tncn",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
