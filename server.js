'use strict';
const config = require('./webpack.config.js');
const routes = require('./app/routes/index.js');

const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const compiler = webpack(config);

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
// const passport = require('passport');
// const session = require('express-session');


var app = express();
require('dotenv').load();
// require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);

app.use(middleware(compiler,{}));

app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

// app.use(session({
// 	secret: 'secretClementine',
// 	resave: false,
// 	saveUninitialized: true
// }));
//
// app.use(passport.initialize());
// app.use(passport.session());

routes(app);

// var io = require('socket.io')(80);
//
// io.on('connection', function (socket) {
//   console.log('connected');
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });

var port = process.env.PORT || 8080;

app.listen(port, function () {
	console.log(`Listening on port ${port}...`);
});
