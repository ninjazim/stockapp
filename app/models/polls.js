'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var Poll = new Schema({
	creator: { type: Schema.Types.ObjectId, ref: 'User' },
	options: [
		{
			name: String,
			votes: Number,
			creator: { type: Schema.Types.ObjectId, ref: 'User' }
		}
	],
	title: String,
	totalVotes: Number,
	timestamps: { createdAt: Date, updatedAt: Date }
},
{ timestamps: {} });

module.exports = mongoose.model('Poll', Poll);
