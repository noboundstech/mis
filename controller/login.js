var express = require('express'),
	app 	= express(),
    router  = express.Router();
require('rootpath')();
/*
router.use(function(req, res, next) {
	var utils = require('utility/utils');
	utils.authenticateUser(req,res,next);
});
*/
router.route('/')
.get(function (req, res) {
	res.json({ message: 'Welcome to the coolest API on earth!' });
})
.post(function (req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});
router.route('/login')
.post(function (req, res) {

	var async 			= require('async');
	var utils   		= require('utility/utils'),
	 	db_query 		= require('db_query/query'),
		constant 		= require("config/constant");
		var db_connect	= require('config/db_connection');
		var admin_user	= require('model/user_admin');
		var connection 	= '';
		var admin_user_model = '';

	var response_data 	= {};
	async.series([
		function(callback) {
			var validate = require('utility/validate');
			validate.validateSignin(req,res,function(){
				callback();
			})
		},
		function(callback) {
			db_connect.db_connect(req,res,function(err,db_connection){
				
				connection = db_connection;
				callback();
			})
		},
		function(callback) {
			admin_user.admin_user_schema(connection,function(admin_user_model_response){
				
				admin_user_model = admin_user_model_response;
				callback();
			})
		},
		function(callback){
			var condition = {
								user_id :req.body.username,
								user_pwd : req.body.password
							};
                             // req,res,condition,option,limit,order,model
			db_query.findFromDb(req,res,condition,{},{},{},admin_user_model, function (err, data) 
	 		{ 				
	 			  if (data.length > 0)
	 			  {	
	 					
	 				if(data[0].active_status == constant.ACTIVE_STATUS)
					{
						response_data.user_details =  data;
						callback();
					}
					else
					{
						response_data.success = false;
						response_data.message = "Please Enter active Username and Password.";
						res.status(203).send({response_data});
					}
				 }
			  	else
				{
					response_data.success = false;
					response_data.message = "Please Enter valid Username and Password.";
					res.status(203).send({response_data});
				}
	 	
	 		});
	 	},	
	 	function(callback)
		{
			utils.createAuthentication(res,res,response_data.user_details[0],function(token){

				
				response_data.token = token;
				callback();
			})
		},	
        function(callback){
			var key_value = req.body.username;
            var fieldlist = {
								last_signin_datetime : new Date()
							};
                                 // req,res,key_value,option,limit,order,model,fieldlist  
			db_query.updateByPrimeryKey(req,res,key_value,{},{},{},admin_user_model,fieldlist, function (err, data) 
	 		{ 			
	 		            //  console.log("data length :",data[0].length);	
	 		             
	 			  if (typeof data != 'undefined' && data != '' && data != null && data != 'error')
	 			  {
	 				  	response_data.user_details =  data;
						callback();
				   }
					else
					{
						response_data.success = false;
						response_data.message = "Update last login not successful";
						res.status(203).send({response_data});
					}
					 	
	 		});
	
		}],function(err) {
			response_data.success = true;
			response_data.message = "successfully login!";
			res.status(200).send({response_data});
		});
	});
router.route('/getUserAccess')
.get(function (req, res) {
 
	var async 			= require('async'),
		constant 		= require("config/constant"),
	 	db_connect		= require('config/db_connection'),
//	    admin_user		= require('model/user_admin');
	    constant 		= require("config/constant");
	    db_query 		= require('db_query/query');
	    response_data 	= {};
	
	var connection 		= '';
//	var admin_user_model = '';
	
	async.series([
		function(callback){
			var utils = require('utility/utils');
			utils.checkAuthentication(req,res,function(){
				req.body.loginUserId = req.decoded.user_id;
                req.body.loginEmpId = req.decoded.emp_id;
				callback();
			})
		},
		function(callback) {
			db_connect.db_connect(req,res,function(err,db_connection){
				
				connection = db_connection;
				callback();
			})
		},
		function(callback){
			var sqlstring = "select a.user_type ,CONCAT(b.f_name,' ',b.l_name) as emp_name, a.emp_id  from "+constant.USER_ACCESS_LEVELS +' as a ,'+constant.EMP_MASTER+" as b ";
			    sqlstring += "where a.user_id = '"+ req.body.loginUserId  + "' and a.emp_id =b.emp_id  and a.effective_status ='1' and a.del_flg = ' '";   
			    console.log('sqlstring :',sqlstring)
			db_query.runQueryOnDb(req,res,sqlstring,connection,function (err, data)
			{
				  if (data.length > 0)
	 			  {	
	 					response_data = data;
						callback();
					}
					else
					{
						response_data.success = false;
						response_data.message = "no rows found in user access table .";
						res.status(203).send({response_data});
					}
				})	;				
			 
	 	}],function(err) {
			response_data.success = true;
			response_data.message = "success!";
			res.status(200).send({response_data});
		});
});
module.exports = router;