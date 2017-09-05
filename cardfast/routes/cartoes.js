module.exports = function (app) {


    app.post('/cartoes/autoriza', function (req, res) {

        req.assert(
            "numero", "Forma de pagamento é obrigatorio"
        ).notEmpty();

        var cartao = req.body;


        //numero, bandeira, ano_de_expiracao, mes_de_expiracao, cvv

        var erros = req.validationErrors();

        if (erros) {
            console.log('Erros de validação encontrados');
            res.status(400).send(erros);
            return;
        }


        cartao.status = 'AUTORIZADO';

        var connection = app.infra.connectionFactory(); //Por causa do CONSIGN, eu consigo andar pelas pastas.
        var pagamentoDAO = new app.infra.PagamentosDAO(connection);

        //invoando o metodo salva do PagamentoDAO.js
        pagamentoDAO.salva(cartao, function (erro, result) {
            if(erro){
                console.log('Erro ao inserir no banco: ' + erro);
                res.status(500).send(erro);
            } else {
                cartao.id = result.insertId;
                console.log("=====> Pagamento Criado <=====");


                //LINK + VERBO + METODO = HATEOAS (Hypermedia As The .....)

                var response = {
                    dados_do_cartao: cartao
                };

                res.status(201).json(response); //formata a saida
            }
        });
    });
};