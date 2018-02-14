'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport) {

  function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.json({});
		}
	}

  var pollHandler = new PollHandler();

  app.route('/auth/github')
   .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));

  app.route('/logout')
  	.get(function (req, res) {
  		req.logout();
  		res.redirect('/');
	});

  app.route('/api/user')
    .get(isLoggedIn, function (req, res) {
      res.json(req.user.github)
    });

  app.route('/api/user/:id')
  	.get(isLoggedIn, function (req, res) {
  		res.json(req.user.github);
	});

  app.route('/api/polls')
		.get(pollHandler.queryParser)
    .post(isLoggedIn, pollHandler.createPoll);

  app.route('/api/polls/:id')
    .get(pollHandler.getPollById)
    .put(pollHandler.updatePoll)
    .delete(pollHandler.deletePoll);

	app.route('*')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

};
