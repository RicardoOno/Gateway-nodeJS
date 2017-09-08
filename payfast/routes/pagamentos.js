module.exports = function (app) {
    app.get('/pagamentos', function (req, res) {
        console.log('====> /Pagamentos <====');
        res.send('/pagamentos conectado');
    });

    //verbo + recurso(pagamento) = operação REST
    app.delete('/pagamentos/pagamento/:id', function (req, res) {
        //curl -X DELETE http://localhost:3000/pagamentos/pagamento/24 -v | json_pp
        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'CANCELADA';

        var connection = app.infra.connectionFactory(); //Por causa do CONSIGN, eu consigo andar pelas pastas.
        var pagamentoDAO = new app.infra.PagamentosDAO(connection);

        pagamentoDAO.atualiza(pagamento, function (err) {

            if(err) {
                res.status(500).send(err);
                return;
            }
            res.status(204).send(pagamento);

        });
        console.log("====> Pagamento cancelado <====");

    });

    app.put('/pagamentos/pagamento/:id', function(req, res) {
        //confirmar
        //curl -X PUT http://localhost:3000/pagamentos/pagamento/[ID da transação] -v para teste
        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'CONFIRMADO';

        var connection = app.infra.connectionFactory(); //Por causa do CONSIGN, eu consigo andar pelas pastas.
        var pagamentoDAO = new app.infra.PagamentosDAO(connection);

        pagamentoDAO.atualiza(pagamento, function (err) {

            if(err) {
                res.status(500).send(err);
                return;
            }
            res.send(pagamento);

        });
        console.log("====> Pagamento atualizado <====");

    });

    app.post('/pagamentos/pagamento', function (req, res) {

        req.assert(
            "pagamento.forma_de_pagamento", "Forma de pagamento é obrigatorio"
        ).notEmpty();

        req.assert(
            "pagamento.valor", "Valor é obrigatorio"
        ).notEmpty().isFloat();

        var erros = req.validationErrors();

        if(erros){
            console.log('Erros de validação encontrados');
            res.status(400).send(erros);
            return;
        }

        console.log('====> /pagamentos/pagamento <====');
        var pagamento = req.body["pagamento"];
        console.log('=====> Procesando uma requisição nova <=====');

        pagamento.status = 'CRIADO';
        pagamento.data = new Date();

        //curl http://localhost:3000/pagamentos/pagamento -X POST -v -H "Content-type: application/json" -d @files/pagamentos.json

        var connection = app.infra.connectionFactory(); //Por causa do CONSIGN, eu consigo andar pelas pastas.
        var pagamentoDAO = new app.infra.PagamentosDAO(connection);

        //invoando o metodo salva do PagamentoDAO.js
        pagamentoDAO.salva(pagamento, function (erro, result) {
            if(erro){
                console.log('Erro ao inserir no banco: ' + erro);
                res.status(500).send(erro);
            } else {
                pagamento.id = result.insertId;
                console.log("=====> Pagamento Criado <=====");
                if(pagamento.forma_de_pagamento == "cartao") {
                    var cartao = req.body["cartao"];
                    console.log(cartao);

                    var clienteCartoes = new app.services.clienteCartoes();

                    clienteCartoes.autoriza(cartao,
                        function (exception, request, response, retorno) {
                            if(exception) {
                                console.log(exception);

                                res.status(400).send(exception);
                                return;
                            }

                            console.log(retorno);
                            res.location('/pagamentos/pagamento/' + pagamento.id);
                            var response = {
                                dados_do_pagamento: pagamento,
                                cartao: retorno,
                                links: [
                                    {
                                        href: "http://localhost:3000/pagamentos/pagamento/"
                                        + pagamento.id,
                                        rel: "confirmar",
                                        method: "PUT"
                                    },
                                    {
                                        href: "http://localhost:3000/pagamentos/pagamento/"
                                        + pagamento.id,
                                        rel: "cancelar",
                                        method: "DELETE"
                                    }
                                ]
                            };

                            res.status(201).json(response);
                            return;

                        });

                } else {
                    res.location('/pagamentos/pagamento/' + pagamento.id);

                    //LINK + VERBO + METODO = HATEOAS (Hypermedia As The .....)
                    var response = {
                        dados_do_pagamento: pagamento,
                        links: [
                            {
                                href: "http://localhost:3000/pagamentos/pagamento/"
                                + pagamento.id,
                                rel: "confirmar",
                                method: "PUT"
                            },
                            {
                                href: "http://localhost:3000/pagamentos/pagamento/"
                                + pagamento.id,
                                rel: "cancelar",
                                method: "DELETE"
                            }
                        ]
                    };

                    res.status(201).json(response); //formata a saida
                }
            }
        });

        //res.send(pagamento);
        /*Para testar via POST:
         [terminal bash]
         curl http://localhost:3000/pagamentos/pagamento -X POST
         or
         curl http://localhost:3000/pagamentos/pagamento -X POST -v
         or
         curl http://localhost:3000/pagamentos/pagamento -X POST; echo
         or
         curl http://localhost:3000/pagamentos/pagamento -X POST -v -H "Content-type: application/json" -d
         '{
         "forma_de_pagamento":"payfast",
         "valor":10.98,
         "moeda":"BRL",
         "descricao":"criando um pagamento"
         }'; echo
         */

    });

};