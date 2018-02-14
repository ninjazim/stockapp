'use strict';

var Polls = require('../models/polls.js');
var Users = require('../models/users.js');

function PollHandler () {

  this.queryParser = function (req, res) {
    if (req.query.filter == "recent") {
      Polls
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({ path: 'creator', select: 'github.username'})
        .populate({ path: 'options.creator', select: 'github.username'})
        .exec(function (err, result) {
  				if (err) { throw err; }
  				res.json(result);
  			});
    } else if (req.query.filter == "popular") {
      Polls
        .find()
        .sort({ totalVotes: -1 })
        .limit(5)
        .populate({ path: 'creator', select: 'github.username'})
        .populate({ path: 'options.creator', select: 'github.username'})
        .exec(function (err, result) {
  				if (err) { throw err; }
  				res.json(result);
  			});
    } else if (req.query.filter == "user") {
      Polls
        .find()
        .sort({ totalVotes: -1 })
        .populate({ path: 'creator', select: 'github.username'})
        .populate({ path: 'options.creator', select: 'github.username'})
        .exec(function (err, result) {
  				if (err) { throw err; }
          let filteredResult = result.filter((poll) => {
            return poll.creator.github.username == req.query.username
          });
  				res.json(filteredResult);
  			});
    } else {
      Polls
        .find()
        .sort({ createdAt: -1 })
        .populate({ path: 'creator', select: 'github.username'})
        .populate({ path: 'options.creator', select: 'github.username'})
        .exec(function (err, result) {
  				if (err) { throw err; }
  				res.json(result);
  			});
    }
  }

  // this.getRecentPolls = function (req, res) {
  //   Polls
  //     .find()
  //     .sort({ createdAt: -1 })
  //     .limit(5)
  //     .populate({ path: 'creator', select: 'github.username'})
  //     .populate({ path: 'options.creator', select: 'github.username'})
  //     .exec(function (err, result) {
	// 			if (err) { throw err; }
	// 			res.json(result);
	// 		});
	// };
  //
  // this.getPopularPolls = function (req, res) {
  //
  //   Polls
  //     .find()
  //     .sort({ totalVotes: -1 })
  //     .limit(5)
  //     .populate({ path: 'creator', select: 'github.username'})
  //     .populate({ path: 'options.creator', select: 'github.username'})
  //     .exec(function (err, result) {
	// 			if (err) { throw err; }
	// 			res.json(result);
	// 		});
	// };

  this.getPollById = function (req, res) {
    Polls
      .findById(req.params.id)
      .populate({ path: 'creator', select: 'github.username'})
      .populate({ path: 'options.creator', select: 'github.username'})
      .exec(function (err, result) {
				if (err) { throw err; }
				res.json(result);
			});
	};

  this.deletePoll = function (req, res) {

    Polls
      .findById(req.params.id)
      .populate({ path: 'creator', select: 'github.username'})
      .exec(function (err, poll) {
				if (err) { throw err; }
        console.log("found poll");
        if (poll.creator.username == req.user.username) {
          console.log("removing poll")
          poll.remove( function (err, deletedPoll) {
            if (err) {throw err;}
            res.json({deleted: true});
          });
        } else {
          console.log("user did not create this poll.")
          res.json({deleted: false});
        }
			});
	};

  this.createPoll = function (req, res) {

    var pollOptions = req.body.options.map((option) => {
      return {
        name: option.name,
        votes: 0,
        creator: req.user._id
      }
    });

    var newPoll = new Polls({
      creator: req.user._id,
      options: pollOptions,
      title: req.body.title,
      totalVotes: 0,
    });

    newPoll.save(function (err, newPoll) {
      if (err) {
        throw err;
      } else {
        console.log("poll saved");
        res.json(newPoll);
      }
    });
	};

  this.updatePoll = function (req, res) {

    Polls
      .findById(req.body.poll._id)
      .populate({ path: 'creator', select: 'github.username'})
      .populate({ path: 'options.creator', select: 'github.username'})
      .exec(function (err, result) {
				if (err) { throw err; }
				var modifiedPoll = result;
        if (req.body.option.new) {
          modifiedPoll.totalVotes += 1;
          modifiedPoll.options.push({
            name: req.body.option.name,
            votes: 1,
            creator: req.user._id
          });
        } else {
          modifiedPoll.totalVotes += 1;
          // console.log("RequestOptionId:",req.body.option._id);
          var updatedOptions = modifiedPoll.options.map((option) => {
            // console.log("OptionId:",option._id);
            if (option._id == req.body.option._id) {
              option.votes += 1;
              return option;
            } else {
              return option
            }
          });
          modifiedPoll.options = updatedOptions;
        }
        modifiedPoll.save((err, savedPoll) => {
          if (err) { throw err; }
          res.json(savedPoll);
        });
			});


    // Polls
    //   .findById(req.body.poll._id, function (err, modifiedPoll) {
    //     if (err) {throw err};
    //     if (req.body.option.new) {
    //       modifiedPoll.totalVotes += 1;
    //       modifiedPoll.options.push({
    //         name: req.body.option.name,
    //         votes: 1,
    //         creator: req.user._id
    //       });
    //     } else {
    //       modifiedPoll.totalVotes += 1;
    //       console.log("RequestOptionId:",req.body.option._id);
    //       var updatedOptions = modifiedPoll.options.map((option) => {
    //         console.log("OptionId:",option._id);
    //         if (option._id == req.body.option._id) {
    //           option.votes += 1;
    //           return option;
    //         } else {
    //           return option
    //         }
    //       });
    //       modifiedPoll.options = updatedOptions;
    //     }
    //     modifiedPoll.save((err, savedPoll) => {
    //       if (err) { throw err; }
    //       res.json(savedPoll);
    //     });
    //   });
  };

  // this.addClick = function (req, res) {
  //   Users
	// 		.findOneAndUpdate({ 'github.id': req.user.github.id }, { $inc: { 'nbrClicks.clicks': 1 } })
	// 		.exec(function (err, result) {
	// 				if (err) { throw err; }
  //
	// 				res.json(result.nbrClicks);
	// 		});
	// };
  //
  // this.resetClicks = function (req, res) {
  //   Users
	// 		.findOneAndUpdate({ 'github.id': req.user.github.id }, { 'nbrClicks.clicks': 0 })
	// 		.exec(function (err, result) {
	// 				if (err) { throw err; }
  //
	// 				res.json(result.nbrClicks);
	// 		});
  // };

}

module.exports = PollHandler;
