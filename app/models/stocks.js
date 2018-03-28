'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Stock = new Schema({
	symbol: String,
	name: String,
},
{ timestamps: {} });

module.exports = mongoose.model('Stock', Stock);
