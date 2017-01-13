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
router.route('/addNewUser')
.post(function (req, res) {
	var async 		= require('async');
	var utils   	= require('utility/utils'),
	 	db_query 	= require('db_query/query'),
		constant 	= require("config/constant");
	var db_connect	= require('config/db_connection'),
	 	admin_user	= require('model/user_admin'),
	 	connection 	= '',
	 	admin_user_model = '';	
	var response_data = {};
	async.series([
		function(callback) {
			var validate = require('utility/validate');
			validate.ValidateAddUser(req,res,function(){
				callback();
			})
		},
		function(callback){
			//authenticating that request is comming with valid token
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
		function(callback) {
			admin_user.admin_user_schema(connection,function(admin_user_model_response){
				
				admin_user_model = admin_user_model_response;
				callback();
			})
		},
		function(callback)
		 {
		       var condition = {user_id :req.body.add_user_id
						       };
                             // req,res,condition,option,limit,order,model
			db_query.findFromDb(req,res,condition,{},{},{},admin_user_model, function (err, data) 
	 		{ 				
	 			  if (data.length > 0)
	 			  {	
					response_data.success = false;
					response_data.message = "User Id Already Exist";
					res.status(203).send({response_data}); 
				  }
				 else
				  {
					callback();
				  }
			})
		},
		function(callback)
		 {
		       var condition = {user_id :req.body.add_user_id,
		       	               email_id :req.body.email_id
						       };
                             // req,res,condition,option,limit,order,model
			var sqlstring = "select user_id, email_id from "+constant.USER_MASTER +" where user_id <> '" +req.body.add_user_id +"' and email_id='"+req.body.email_id +"'";
			console.log('sqlstring :',sqlstring)                
			db_query.runQueryOnDb(req,res,sqlstring,connection,function (err, data)
		//	db_query.findFromDb(req,res,condition,{},{},{},admin_user_model, function (err, data) 
	 		{ 				
	 			  if (data.length > 0)
	 			  {	
					response_data.success = false;
					response_data.message = "Email Id Already Exist";
					res.status(203).send({response_data}); 
				  }
				 else
				  {
					callback();
				  }
			})
		},
		function(callback)
		{
				var fieldlist  = { user_id    : req.body.add_user_id,						
						       user_pwd   : req.body.password,						
						       emp_id     : req.body.user_emp_detail,
						       mgr_emp_id : req.body.user_Manager,
						    activated_on_date : req.body.active_date,
							active_status     : req.body.Active_Status,
						    active_status_reason : req.body.Active_Status_reason,
							email_id             : req.body.email_id,
							inserted_by_user     : req.body.loginUserId,						
						    inserted_on_dtime    : new Date(),						   
					        updated_by_user      : req.body.loginUserId,						  
							updated_on_dtime     : new Date()
						   }
						 
						
	    	condition   = '';

	    	db_query.insertToDb(req,res,fieldlist,admin_user_model,function(err, data){
	    		  if (typeof data != 'undefined' && data != '' && data != null && data != 'error')
	 			   {
	 				  	response_data.details =  data;
						callback();
				   }
					else
					{
						response_data.success = false;
						response_data.message = "Insert to USER table not successful";
						res.status(203).send({response_data});
					}
	    	});
	}],function(err) {
		response_data.success = true;
		response_data.message = "User Added Successfully.!";
		res.status(200).send({response_data});
	});
});
router.route('/updateUserDetails')
.post(function (req, res) {
	var async 		= require('async');
	var utils   	= require('utility/utils'),
	 	db_query 	= require('db_query/query'),
		constant 	= require("config/constant");
	var db_connect	= require('config/db_connection'),
	 	admin_user	= require('model/user_admin'),
	 	connection 	= '',
	 	admin_user_model = '';	
	var response_data = {};
	async.series([
		function(callback) {
			var validate = require('utility/validate');
			validate.ValidateUpdateUser(req,res,function(){
				callback();
			})
		},
		function(callback){
			//authenticating that request is comming with valid token
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
		function(callback) {
			admin_user.admin_user_schema(connection,function(admin_user_model_response){
				
				admin_user_model = admin_user_model_response;
				callback();
			})
		},
		function(callback)
		 {
		       var condition = {user_id :req.body.user_id,
		       	                email_id :req.body.email_id
						       };
                             // req,res,condition,option,limit,order,model
            var sqlstring = "select user_id, email_id from "+constant.USER_MASTER +" where user_id <> '" +req.body.user_id +"' and email_id='"+req.body.email_id +"'";
			console.log('sqlstring :',sqlstring)                
			db_query.runQueryOnDb(req,res,sqlstring,connection,function (err, data)                 
		//	db_query.findFromDb(req,res,condition,{},{},{},admin_user_model, function (err, data) 
	 		{ 				
	 			  if (data.length > 0)
	 			  {	
	 		
				
					error_message = "Email Id Already Exist.";
					res.status(203).send({   "status"         : false,
                                             "error_type"     : "Duplicate Email id error",
                                            "message"         : error_message
                                });
				  }
				 else
				  {
					callback();
				  }
			})
		},
		function(callback)
		{
			var key_value = req.body.user_id;
            var fieldlist = {
							user_pwd   : req.body.user_pwd,						
						    emp_id     : req.body.emp_id,
						    mgr_emp_id : req.body.mgr_emp_id,
						    activated_on_date : req.body.activated_on_date,
							active_status : req.body.active_status,
						    active_status_reason : req.body.active_status_reason,
							email_id : req.body.email_id,
							updated_by_user : req.body.loginUserId,						  
							updated_on_dtime :new Date()
							
							};
			console.log('fieldlist :',fieldlist)				
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
						console.log('error :',err)
						response_data.success = false;
						response_data.message = "Update User data not successful";
					//	response_data.message = err;
						res.status(203).send({response_data});
					}
					 	
	 		});
	
	}],function(err) {
		response_data.success = true;
		response_data.message = "User Updated Successfully.!";
		res.status(200).send({response_data});
	});
});
module.exports = router;