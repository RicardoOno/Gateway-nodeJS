var express = require('express');
var consign = require('consign');

module.exports = function (){
    var app = express();

    consign() //faz rotas
        .include('routes')
        .into(app);

    return app;
};