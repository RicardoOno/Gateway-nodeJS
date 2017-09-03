module.exports = function (app) {
    app.get('/pagamentos', function (req, res) {
        console.log('====> /Pagamentos <====');
        res.send('/pagamentos conectado');
    });

    app.get('/teste', function (req, res) {
       console.log('====> /Teste <====');
       res.send('/teste conectado');
    });

};