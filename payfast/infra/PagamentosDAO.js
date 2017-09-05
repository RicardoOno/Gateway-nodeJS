function PagamentosDAO(connection) {
    this._connection = connection;
}

PagamentosDAO.prototype.salva = function (pagamento, callback) {
    this._connection.query('INSERT INTO pagamentos SET ?', pagamento, callback);
};

PagamentosDAO.prototype.atualiza = function (pagamento, callback) {
    this._connection.query('UPDATE pagamentos SET status = ? where id = ?', [pagamento.status, pagamento.id], callback);
};

PagamentosDAO.prototype.lista = function (callback) {
    this._connection.query('SELECT * FROM pagamentos', callback);
};

PagamentosDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query('SELECT * FROM pagamentos where id = ' +id, callback);
};

module.exports = function () {
    return PagamentosDAO;
};

