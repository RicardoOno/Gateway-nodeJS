//curl -X POST http://localhost:3001/correios/calculo-prazo -H "Contenty-type: application/json" -d @files/dados-entrega.json

//Dando erro

module.exports = function (app) {
  app.post('/correios/calculo-prazo', function (req, res) {
      console.log('===> POST de Calcula Prazo <===');
      var dadosDaEntrega = req.body;

      var correiosSOAPClient = new app.services.correiosSOAPClient();
      correiosSOAPClient.calculaPrazo(dadosDaEntrega,
          function (erro, resultado) {

          if(erro){
              res.status(500).send(erro);
              return;
          }
          console.log('===> Prazo Calculado <===');
          res.json(resultado);

      });
  });
};