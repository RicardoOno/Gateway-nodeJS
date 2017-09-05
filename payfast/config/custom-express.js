var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

module.exports = function (){
    var app = express();

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.use(expressValidator());

    consign() //faz rotas | ver no log do nodemon
        .include('routes')
        .then('infra')
        .then('services')
        .into(app);

    return app;
};