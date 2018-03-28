'use strict';

const config = require('./webpack.config.js');
const routes = require('./app/routes/index.js');

const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const compiler = webpack(config);

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const app = express();
const server = require('http').createServer();
require('dotenv').load();

mongoose.connect(process.env.MONGO_URI);

app.use(middleware(compiler,{}));

app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

routes(app);

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({port: 40510});

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

const port = process.env.PORT || 8080;

app.listen(port, function () {
	console.log(`Listening on port ${port}...`);
});
