require('rootpath')();
module.exports = function (app) {
  	app.use('/api', require('controller/api'));
  	app.use('/userLogin', require('controller/login'));
   	app.use('/userAdmin', require('controller/user_admin_control'));
  	app.use('/lms', require('controller/lms_system'));
};
