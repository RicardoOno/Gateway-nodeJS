var restify = require('restify-clients');

var cliente = restify.createJsonClient({
    url:'http://localhost:3001'
});

cliente.post('/cartoes/autoriza', function (err, req, res, retorno) {
    console.log('Consumindo servico de cartoes');
    console.log(retorno);
});

CartoesClient.prototype.autoriza = function(cartao, callback) {
    this._client.post('/cartoes/autoriza', cartao, callback);
};

module.exports = function(){
    return CartoesClient;
};
