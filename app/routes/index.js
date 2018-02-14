'use strict';

// SERVER ROUTES //

// var Handler = require(process.cwd() + '/app/controllers/Handler.server.js');

var path = process.cwd();

var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport) {

  function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.json({});
		}
	}

	// var handler = new Handler(db);

  var clickHandler = new ClickHandler();
  var pollHandler = new PollHandler();

  app.route('/clementine')
  	.get(isLoggedIn, function (req, res) {
  		res.sendFile(path + '/public/clementine.html');
	});

  // app.route('/login')
  // 	.get(function (req, res) {
  // 		res.sendFile(path + '/public/login.html');
	// });
  //
  // app.route('/logout')
  // 	.get(function (req, res) {
  // 		req.logout();
  // 		res.redirect('/login');
	// });
  //
  // app.route('/profile')
  // 	.get(isLoggedIn, function (req, res) {
  // 		res.sendFile(path + '/public/profile.html');
	// });

  app.route('/api/user')
    .get(isLoggedIn, function (req, res) {
      res.json(req.user.github)
    });

  app.route('/api/user/:id')
  	.get(isLoggedIn, function (req, res) {
  		res.json(req.user.github);
	});

  app.route('/auth/github')
	 .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
  	.get(passport.authenticate('github', {
  		successRedirect: '/',
  		failureRedirect: '/login'
	  }));

  //
  //
  //
  // app.route('/clementine')
  // 	.get(function (req, res) {
  // 		res.sendFile(path + '/public/clementine.html');
	// });
  //
  // app.route('/secret')
	// 	.get(function (req, res) {
	// 		res.send("You found me!");
	// 	});

  // app.route('/api/:id/clicks')
	// 	.get(clickHandler.getClicks)
	// 	.post(clickHandler.addClick)
	// 	.delete(clickHandler.resetClicks);

  app.route('/api/polls')
		.get(pollHandler.queryParser)
    .post(isLoggedIn, pollHandler.createPoll);
		// .delete(clickHandler.resetClicks)

  // app.route('/api/polls/recent')
  //   .get(pollHandler.getRecentPolls);
  //
  // app.route('/api/polls/popular')
  //   .get(pollHandler.getPopularPolls);

  app.route('/api/polls/:id')
    .get(pollHandler.getPollById)
    .put(pollHandler.updatePoll)
    .delete(pollHandler.deletePoll);

	app.route('*')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

};
