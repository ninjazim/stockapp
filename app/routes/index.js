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

  var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer();

    wss.on('connection', function (ws) {
      console.log('client connected');
    ws.on('message', function (message) {
      let data = JSON.parse(message);
      switch(data.type) {
        case 'added':
          console.log(`client added ${data.symbol}`);
          wss.clients.forEach((client) => {
            if (client !== ws) { client.send(message) }

          });
          break;
        case 'removed':
          console.log(`client removed ${data.symbol}`);
          wss.clients.forEach((client) => {
            if (client !== ws) { client.send(message) }
          });
          break;
      }
    });
    ws.on('close', function close() {
      console.log('disconnected');
    });
  });
};
