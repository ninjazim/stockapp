'use strict';

var path = process.cwd();
var StockHandler = require(path + '/app/controllers/stockHandler.server.js');

module.exports = function (app) {

  var stockHandler = new StockHandler();

  app.route('/api/stocks')
		.get(stockHandler.getStocks)
    .post(stockHandler.addStock);

  app.route('/api/stocks/:symbol')
    .delete(stockHandler.removeStock);

	app.route('*')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
};
