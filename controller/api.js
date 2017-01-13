var express = require('express'),
	jwt 	= require('jsonwebtoken'),
	config  = require('config/config'),
    router  = express.Router();
//    _       = require('underscore');
require('rootpath')();
router.route('/')
.get(function (req, res) {
     res.status(404).send("We're sorry,but the page you're looking for can't be found" );
})
.post(function (req, res) {
     res.status(404).send("We're sorry,but the page you're looking for can't be found");
});

// api to read all previous winner ticket from text file 
router.route('/getUserDetails')
.post(function (req, res) {
 
	var async 			= require('async'),
		constant 		= require("config/constant"),
	 	db_connect		= require('config/db_connection'),
	    constant 		= require("config/constant");
	    db_query 		= require('db_query/query');
	    response_data 	= {};
	var connection 		= '';
	
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
			var sqlstring = "select a.*,CONCAT(b.f_name,' ',b.l_name) as Manager from "+constant.USER_MASTER + " as a ,"+ constant.EMP_MASTER + " as b where a.mgr_emp_id=b.emp_id";
			
			db_query.runQueryOnDb(req,res,sqlstring,connection,function (err, data)
			{
				  if (data.length > 0)
	 			  {	
	 					response_data.details = data;
						callback();
					}
					else
					{
						response_data.success = false;
						response_data.message = "no rows found in user table .";
						res.status(203).send({response_data});
					}
				})	;				
		
	 	}],function(err) {
			response_data.success = true;
			response_data.message = "success!";
			res.status(200).send({response_data});
		});
});

router.route('/getEmpList')
.get(function (req, res) {
 
	var async 			= require('async'),
		constant 		= require("config/constant"),
	 	db_connect		= require('config/db_connection'),
	    admin_user		= require('model/user_admin');
	    constant 		= require("config/constant");
	    db_query 		= require('db_query/query');
	    response_data 	= {};
	var admin_user		= require('model/user_admin');
	var connection 		= '';
	var admin_user_model = '';
	
	async.series([
		function(callback){
			var utils = require('utility/utils');
			utils.checkAuthentication(req,res,function(){
				
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
			var sqlstring = "select emp_id ,CONCAT(f_name,' ',l_name) as name  from "+ constant.EMP_MASTER+" order by f_name,l_name";
			                
			db_query.runQueryOnDb(req,res,sqlstring,connection,function (err, data)
			{
				  if (data.length > 0)
	 			  {	
	 					response_data.details = data;
						callback();
					}
					else
					{
						response_data.success = false;
						response_data.message = "no rows found in user table .";
						res.status(203).send({response_data});
					}
				})	;				
			 
	 	}],function(err) {
			response_data.success = true;
			response_data.message = "success!";
			res.status(200).send({response_data});
		});
});

router.route('/getEmpMgrList')
.get(function (req, res) {
 
	var async 			= require('async'),
		constant 		= require("config/constant"),
	 	db_connect		= require('config/db_connection'),
	    admin_user		= require('model/user_admin');
	    constant 		= require("config/constant");
	    db_query 		= require('db_query/query');
	    response_data 	= {};
	var admin_user		= require('model/user_admin');
	var connection 		= '';
	var admin_user_model = '';
	
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
			var sqlstring = "select a.mgr_emp_id ,CONCAT(b.f_name,' ',b.l_name) as name  from "+ constant.EMP_MGR_DETAIL+ " as a ,"+ constant.EMP_MASTER+" as b where a.mgr_emp_id=b.emp_id and a.emp_id ="+req.body.loginEmpId+" order by name";
			                
			db_query.runQueryOnDb(req,res,sqlstring,connection,function (err, data)
			{
				  if (data.length > 0)
	 			  {	
	 					response_data.details = data;
						callback();
					}
					else
					{
						response_data.success = false;
						response_data.message = "no rows found in employee manager user table .";
						res.status(203).send({response_data});
					}
				})	;				
			 
	 	}],function(err) {
			response_data.success = true;
			response_data.message = "success!";
			res.status(200).send({response_data});
		});
});

router.route('/getHolidayList')
.get(function (req, res) {
 
	var async 			= require('async'),
		constant 		= require("config/constant"),
	 	db_connect		= require('config/db_connection'),
         utils = require('utility/utils'),
	    constant 		= require("config/constant");
	    db_query 		= require('db_query/query');
	    response_data 	= {};
	var connection 		= '';
    var todays_date 	= new Date(),
          curr_year     = todays_date.getFullYear(),
          curr_month    = todays_date.getMonth()+1;
    var   curr_date 	= todays_date.getFullYear()+"-"+utils.pad0(curr_month,2)+"-"+utils.pad0(todays_date.getDate(),2);  
	
	async.series([
		function(callback){
			var utils = require('utility/utils');
			utils.checkAuthentication(req,res,function(){
				
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
		//	var sqlstring = "select holiday_date,holiday_type  from "+ constant.HOLIDAY_LIST+ " where ('"+curr_date+"'  between from_date and to_date ) order by holiday_date";
			var sqlstring = "select DATE_FORMAT(holiday_date,'%Y-%m-%d') as holiday_date  ,holiday_type  from "+ constant.HOLIDAY_LIST+ " where ('"+curr_date+"'  between from_date and to_date ) order by holiday_date";
			               
			db_query.runQueryOnDb(req,res,sqlstring,connection,function (err, data)
			{
				  if (data.length > 0)
	 			  {	  
	 					response_data.details = data;
						callback();
					}
					else
					{
						response_data.success = false;
						response_data.message = "no rows found in Holiday master table .";
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