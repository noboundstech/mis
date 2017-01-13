var express = require('express'),
	app 	= express(),
    router  = express.Router();
require('rootpath')();
router.use(function(req, res, next) {
	var utils = require('utility/utils');
	utils.authenticateUser(req,res,next);
});
router.route('/')
.get(function (req, res) {
     res.json({ message: 'Welcome to the coolest API on earth!' });
})
.post(function (req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});
router.route('/check')
.get(function (req, res) {
     res.json(req.decoded);
});
module.exports = router;