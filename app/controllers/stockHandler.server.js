'use strict';

var Stocks = require('../models/stocks.js');

function StockHandler () {

  this.getStocks = (req, res) => {
    Stocks
      .find()
      .sort({ createdAt: 1 })
      .exec((err, result) => {
        if (err) { throw err; }
        res.json(result);
      });
  }

  this.addStock = (req, res) => {
    console.log(req.body);
    var newStock = new Stocks({
      symbol: req.body.symbol,
      name: req.body.name,
    });

    newStock.save((err, saved) => {
      if (err) { throw err; }
      res.json(saved);
    });
  }

  this.removeStock = (req, res) => {
    Stocks
      .remove({ symbol: req.params.symbol })
      .exec((err) => {
        if (err) { throw err; }
        console.log(`${req.params.symbol} deleted.`)
        let deleted = { deleted: true, symbol:req.params.symbol };
        res.json(deleted);
      });
  }
}

module.exports = StockHandler;
