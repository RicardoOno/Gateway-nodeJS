function PagamentosDAO(connection) {
    this._connection = connection;
}

PagamentosDAO.prototype.salva = function (cartao, callback) {
    this._connection.query('INSERT INTO cartoes SET ?', cartao, callback);
};

PagamentosDAO.prototype.atualiza = function (cartao, callback) {
    this._connection.query('UPDATE cartoes SET status = ? where id = ?', [cartao.status, cartao.id], callback);
};

PagamentosDAO.prototype.lista = function (callback) {
    this._connection.query('SELECT * FROM cartoes', callback);
};

PagamentosDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query('SELECT * FROM cartoes where id = ' +id, callback);
};

module.exports = function () {
    return PagamentosDAO;
};

