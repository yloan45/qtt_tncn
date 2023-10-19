const express = require('express');
const path = require('path');

const configViewEngine = (app) => {
    app.set('view engine', 'ejs')
    app.set('views', path.join(__dirname, '../views/'));
    app.use(express.static('./app/public/'));
}

module.exports = configViewEngine;
