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
router.route('/getLeaveDetails')
.post(function (req, res) {
 
	var async 			= require('async'),
		constant 		= require("config/constant"),
	 	db_connect		= require('config/db_connection'),
	    constant 		= require("config/constant");
	    db_query 		= require('db_query/query');
	    response_data 	= {};
    var utils = require('utility/utils');
	var connection 		= '';
    var todays_date 	= new Date(),
          curr_year     = todays_date.getFullYear(),
          curr_month    = todays_date.getMonth()+1;
    var   curr_date 	= todays_date.getFullYear()+"-"+utils.pad0(curr_month,2)+"-"+utils.pad0(todays_date.getDate(),2);  
	    if (curr_month <=3 )
	    {	
		var string_date_year =todays_date.getFullYear()-1;
		} 
	    else
	    {	
	   	var string_date_year =todays_date.getFullYear();
	   	} 
	 //   set from date to 1-April current LMS year Apr to March mm is 03 as Jan start with 0;
	    var  m_from_date =new Date(string_date_year,'03','01');
	  
	//     var timeDiff = Math.abs(todays_date.getTime() - m_from_date.getTime());   
     //    var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
         var dayDifference = utils.calc_date_diff_days(m_from_date,todays_date);
         var monthDifference = utils.calc_date_diff_months(m_from_date,todays_date);
         console.log("dayDifference:",dayDifference)	
         console.log("monthDifference:",monthDifference)	
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
			console.log('user id apply :',req.body.loginEmpId) 
			var sqlstring = "select a.cl_allot,a.ml_allot,a.ml_caryover,a.el_allot,a.el_caryover,a.flot_allot,a.othe_allot, b.cl_avail,b.ml_avail,b.el_avail,b.flot_avail,b.othe_avail from "+ constant.LMS_MASTER+ " as a , "+ constant.LMS_LEAVE_AVAIL +" as b where a.emp_id = "+req.body.loginEmpId +" and a.emp_id=b.emp_id and ('"+curr_date+"'  between a.from_date and a.to_date ) and ('"+curr_date+"'  between b.from_date and b.to_date)" ;
            
	                      
			db_query.runQueryOnDb(req,res,sqlstring,connection,function (err, data)
			{
				  if (data.length > 0)
	 			  {	     
	 					// var cl_bal= Math.round(((data[0].cl_allot/365) * dayDifference) - data[0].cl_avail);	
	 					// var ml_bal= Math.round(((data[0].ml_allot/365) * dayDifference)) + data[0].ml_caryover - data[0].ml_avail ;
	 					// var el_bal= Math.round(((data[0].el_allot/365) * dayDifference)) + data[0].el_caryover - data[0].el_avail;  
						 var cl_bal= Math.round(((data[0].cl_allot/12) * monthDifference)) - data[0].cl_avail;	
	 					 var ml_bal= Math.round(((data[0].ml_allot/12) * monthDifference)) + data[0].ml_caryover - data[0].ml_avail ;
	 					 var el_bal= Math.round(((data[0].el_allot/12) * monthDifference)) + data[0].el_caryover - data[0].el_avail;  
						response_data.Leave_bal_year = { "CL" : data[0].cl_allot - data[0].cl_avail,
					                                     "ML" : data[0].ml_allot + data[0].ml_caryover - data[0].ml_avail,
					                                     "EL" : data[0].el_allot + data[0].el_caryover - data[0].el_avail,
					                                     "FL" : data[0].flot_allot - data[0].flot_avail,
					                                     "OH" : data[0].othe_allot - data[0].othe_avail
					                                      };
					    response_data.Leave_bal_todate = { "CL" : cl_bal ,
					                                       "ML" : ml_bal ,
					                                       "EL" : el_bal ,
					                                       "FL" : data[0].flot_allot - data[0].flot_avail,
					                                       "OH" : data[0].othe_allot - data[0].othe_avail
					                                      };
					    
                        console.log('response_data :',response_data)
						callback();
					}
					else
					{
						response_data.success = false;
						response_data.message = "no rows found in user table .";
						res.status(203).send({response_data});
					}
				});				
		},
		function(callback){
			 
			var sqlstring = "select a.*,CONCAT(b.f_name,' ',b.l_name) as Manager from "+constant.LMS_LEAVE_APPLY + " as a ,"+ constant.EMP_MASTER + " as b where a.emp_id = "+req.body.loginEmpId +" and  a.mgr_emp_id=b.emp_id";
           	console.log('sqlstring :', sqlstring)                   
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
						response_data.message = "no rows found in leave apply table .";
						res.status(203).send({response_data});
					}
				});
	 	}],function(err) {
			response_data.success = true;
			response_data.message = "success!";
			res.status(200).send({response_data});
		});
});
router.route('/getApproveDetails')
.post(function (req, res) {
 
	var async 			= require('async'),
		constant 		= require("config/constant"),
	 	db_connect		= require('config/db_connection'),
	    constant 		= require("config/constant");
	    db_query 		= require('db_query/query');
	    response_data 	= {};
    var utils = require('utility/utils');
	var connection 		= '';
    var todays_date 	= new Date(),
          curr_year     = todays_date.getFullYear(),
          curr_month    = todays_date.getMonth()+1;
    var   curr_date 	= todays_date.getFullYear()+"-"+utils.pad0(curr_month,2)+"-"+utils.pad0(todays_date.getDate(),2);  
	    if (curr_month <=3 )
	    {	
		var string_date_year =todays_date.getFullYear()-1;
		} 
	    else
	    {	
	   	var string_date_year =todays_date.getFullYear();
	   	} 
	 //   set from date to 1-April current LMS year Apr to March mm is 03 as Jan start with 0;
	    var  m_from_date =new Date(string_date_year,'03','01');
	  
	//     var timeDiff = Math.abs(todays_date.getTime() - m_from_date.getTime());   
     //    var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
         var dayDifference = utils.calc_date_diff_days(m_from_date,todays_date);
         console.log("dayDifference:",dayDifference)		
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
			 
			var sqlstring = "select a.*,CONCAT(b.f_name,' ',b.l_name) as Name from "+constant.LMS_LEAVE_APPLY + " as a ,"+ constant.EMP_MASTER + " as b where a.emp_id=b.emp_id and a.mgr_emp_id="+req.body.loginEmpId;
           	 console.log('sqlstring :',sqlstring)                      
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
						response_data.message = "no rows found in leave apply table .";
						res.status(203).send({response_data});
					}
				});
	 	}],function(err) {
			response_data.success = true;
			response_data.message = "success!";
			res.status(200).send({response_data});
		});
});
router.route('/validateLeaveApply')
.post(function (req, res) {
 
	var async 			= require('async'),
		constant 		= require("config/constant"),
	 	db_connect		= require('config/db_connection'),
	    constant 		= require("config/constant");
	    db_query 		= require('db_query/query');
	    response_data 	= {};
    var utils = require('utility/utils');
	var connection 		= '';
    var todays_date 	= new Date(),
          curr_year     = todays_date.getFullYear(),
          curr_month    = todays_date.getMonth()+1;
    var   curr_date 	= todays_date.getFullYear()+"-"+utils.pad0(curr_month,2)+"-"+utils.pad0(todays_date.getDate(),2);  
	    if (curr_month <=3 )
	    {	
		var string_date_year =todays_date.getFullYear()-1;
		} 
	    else
	    {	
	   	var string_date_year =todays_date.getFullYear();
	   	} 
	 //   set from date to 1-April current LMS year Apr to March mm is 03 as Jan start with 0;
	    var  m_from_date =new Date(string_date_year,'03','01');
	 console.log('inside validateLeaveApply');	
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
		    var r_from_dt= req.body.from_date;
		    var r_to_dt= req.body.to_date;
		//	var sqlstring = "select a.cl_allot,a.ml_allot,a.ml_caryover,a.el_allot,a.el_caryover,a.flot_allot,a.othe_allot, b.cl_avail,b.ml_avail,b.el_avail,b.flot_avail,b.othe_avail from "+ constant.LMS_MASTER+ " as a , "+ constant.LMS_LEAVE_AVAIL +" as b where a.emp_id = "+req.body.loginEmpId +" and a.emp_id=b.emp_id and ('"+curr_date+"'  between a.from_date and a.to_date ) and ('"+curr_date+"'  between b.from_date and b.to_date)" ;
            var sqlstring = " Select count(*) as cnt from "+ constant.LMS_LEAVE_APPLY + " where (('"+ r_from_dt + "' between from_date and  to_date ) or ";
                sqlstring += " ('"	+ r_to_dt + "' between from_date and  to_date ) or ";
                sqlstring += " (from_date between '"+ r_from_dt +"'" + "and '"  +r_to_dt +"') or";
                sqlstring += " (to_date between '"+ r_from_dt +"'" + "and '"  +r_to_dt +"' )) and leave_status in('APPLIED' ,'APPROVED')";
			console.log('sqlstring :',sqlstring)
			db_query.runQueryOnDb(req,res,sqlstring,connection,function (err, data)
			{     
				  if (data[0].cnt == 0)
	 			  {	     
	 					
					    
                        console.log('response_data :',response_data)
						callback();
					}
					else
					{
						response_data.success = false;
						response_data.message = "From Date or To Date is overlapping with previous Leave .";
						res.status(203).send({response_data});
					}
				});				
		},
		function(callback){
			if (req.body.Leave_Type == 'FL' || req.body.Leave_Type == 'OH')
			{
				callback();
			}
			var str1=req.body.from_date.split("-");
			var str2=req.body.to_date.split("-");
			var m_from_date=new Date(str1[0],Math.abs(str1[1]) -1 ,str1[2]);
			var m_to_date=new Date(str2[0],Math.abs(str2[1]) -1,str2[2]);

			var nextDay = new Date(m_to_date);
			var prevDay = new Date(m_from_date)	

			nextDay.setDate(m_to_date.getDate()+1);
			prevDay.setDate(m_from_date.getDate()-1);

			var d1 = nextDay.getDay();
			if (d1==0)
			{
				nextDay.setDate(m_to_date.getDate() + 1);
			}

			var d2 = prevDay.getDay();
			if (d2==0)
			{
			    prevDay.setDate(m_from_date.getDate() - 1);
			}
            var d =utils.ConvertDate(prevDay);
                prevDay=d;
                d =utils.ConvertDate(nextDay);
                nextDay=d;
                console.log('nextDay :', nextDay)   
                console.log('prevDay :', prevDay)  
			var sqlstring = " Select count(*) as cnt from "+ constant.LMS_LEAVE_APPLY + " where (('"	+ nextDay + "' between from_date and  to_date ) and  leave_type !='"+ req.body.Leave_Type+ "' ) or";
                sqlstring += "(('" + prevDay + "' between from_date and  to_date ) and  leave_type !='"+ req.body.Leave_Type+ "' ) ";
            	
           	console.log('sqlstring :', sqlstring)                   
			db_query.runQueryOnDb(req,res,sqlstring,connection,function (err, data)
			{
				  if (data[0].cnt == 0)
				 	{  
	 				 	response_data.details = data;
                
						callback();
					}
					else
					{
						response_data.success = false;
						response_data.message = "CL/ML/EL can not be combined .";
						res.status(203).send({response_data});
					}
				});
	 	}],function(err) {
			response_data.success = true;
			response_data.message = "success!";
			res.status(200).send({response_data});
		});
});
router.route('/applyLeave')
.post(function (req, res) {
	var async 		= require('async');
	var utils   	= require('utility/utils'),
	 	db_query 	= require('db_query/query'),
		constant 	= require("config/constant");
	var db_connect	= require('config/db_connection'),
	 	leave_apply	= require('model/leave_apply'),
	 	connection 	= '', 
	 	leave_apply_model = '';
	var todays_date 	= new Date(),
          curr_year     = todays_date.getFullYear(),
          curr_month    = todays_date.getMonth()+1;
    var   curr_date 	= todays_date.getFullYear()+"-"+utils.pad0(curr_month,2)+"-"+utils.pad0(todays_date.getDate(),2);  
    var m_nofdays =0.00;
	var response_data = {};
	async.series([
		function(callback) {
			var validate = require('utility/validate');
			validate.ValidateApplyLeave(req,res,function(){
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
			leave_apply.leave_apply_schema(connection,function(leave_apply_model_response){
				
				leave_apply_model = leave_apply_model_response;
				callback();
			})
		},
		function(callback)
		{
				
			if (req.body.half_day_flag == 'Y')
			{
				m_nofdays = 0.5;

			}	
			else
			{
				m_nofdays = req.body.nofdays;
			}			      
			var fieldlist  = { del_flg     : ' ',
				               from_date   : req.body.from_date,						
						       to_date     : req.body.to_date,						
						       emp_id      : req.body.loginEmpId,
						       mgr_emp_id  : req.body.leave_Manager,
						       leave_type  : req.body.Leave_Type,
							   nofdays     : m_nofdays,
						      leave_status : req.body.Leave_Status,
							half_day_flag  : req.body.half_day_flag,
							inserted_by_user     : req.body.loginUserId,						
						    inserted_on_dtime    : new Date(),						   
					        updated_by_user      : req.body.loginUserId,						  
							updated_on_dtime     : new Date()
						   }
	
	    	condition   = '';
		    console.log('fieldlist :',fieldlist)
	    	db_query.insertToDb(req,res,fieldlist,leave_apply_model,function(err, data){
	    		  if (typeof data != 'undefined' && data != '' && data != null && data != 'error')
	 			   {
	 				  	response_data.details =  data;
						callback();
				   }
					else
					{
						response_data.success = false;
						response_data.message = "Insert to Leave Apply table not successful";
						res.status(203).send({response_data});
					}
	    	});
	    },
	     function(callback)
		{       var upd_field=' ';
		        if (req.body.Leave_Type == 'CL')
		          {	
		        	upd_field='a.cl_avail=a.cl_avail +'+ m_nofdays;
		          }	
		        else  if (req.body.Leave_Type == 'EL')
		          {	
		        	upd_field='a.el_avail=a.el_avail +'+ m_nofdays;
		          }
		        else  if (req.body.Leave_Type == 'ML')
		          {	
		        	upd_field='a.ml_avail=a.ml_avail +'+ m_nofdays;
		          }
		        else  if (req.body.Leave_Type == 'FL')
		          {	
		        	upd_field='a.flot_avail=a.flot_avail +'+ m_nofdays;
		          }  
		        else
		          {	
		        	upd_field='a.othe_avail=a.othe_avail +'+ m_nofdays;
		          } 
		        var condition = "'"+curr_date + "' between a.from_date and a.to_date and  a.emp_id="+ req.body.loginEmpId;	
				var sqlstring = "update "+ constant.LMS_LEAVE_AVAIL + " as a set "+ upd_field + " where " + condition;
           	    console.log('sqlstring upd avail sql:',sqlstring)                
			db_query.runQueryOnDb(req,res,sqlstring,connection,function (err, data)
			{
				  if (data.changedRows == 1)
				 	{  
	 				 	response_data.details = data;
                
						callback();
					}
					else
					{
						response_data.success = false;
						response_data.message = "no rows found in leave avail table .";
						res.status(203).send({response_data});
					}
				});
	}],function(err) {
		response_data.success = true;
		response_data.message = "Leave Apply added/updated Successfully.!";
		res.status(200).send({response_data});
	});
});
router.route('/updateLeaveApply')
.post(function (req, res) {
	var async 		= require('async');
	var utils   	= require('utility/utils'),
	 	db_query 	= require('db_query/query'),
		constant 	= require("config/constant");
	var db_connect	= require('config/db_connection'),
	 	leave_apply	= require('model/leave_apply'),
	 	connection 	= '',
	 	leave_apply_model = '';	
	var response_data = {};
	async.series([
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
			leave_apply.leave_apply_schema(connection,function(leave_apply_model_response){
				
				leave_apply_model = leave_apply_model_response;
				callback();
			})
		},
		function(callback)
		{
			var key_value = req.body.id;
            var fieldlist = {
							leave_status : req.body.leave_status,					
						  	updated_by_user : req.body.loginUserId,						  
							updated_on_dtime :new Date()
							
							};
			console.log('key_value :',key_value)		
			console.log('fieldlist :',fieldlist)				
                        // req,res,key_value,option,limit,order,model,fieldlist  
			db_query.updateByPrimeryKey(req,res,key_value,{},{},{},leave_apply_model,fieldlist, function (err, data) 
	 		{ 			
	 		            //  console.log("data length :",data[0].length);	
	 		             
	 			  if (typeof data != 'undefined' && data != '' && data != null && data != 'error')
	 			  {
	 				  	response_data.leave_details =  data;
						callback();
				   }
					else
					{
						response_data.success = false;
						response_data.message = "Update leave status not successful";
						res.status(203).send({response_data});
					}
					 	
	 		});
	
	}],function(err) {
		response_data.success = true;
		response_data.message = "Leave Status Updated Successfully.!";
		res.status(200).send({response_data});
	});
});
router.route('/cancelLeaveApply')
.post(function (req, res) {
	var async 		= require('async');
	var utils   	= require('utility/utils'),
	 	db_query 	= require('db_query/query'),
		constant 	= require("config/constant");
	var db_connect	= require('config/db_connection'),
	 	leave_apply	= require('model/leave_apply'),
	 	connection 	= '',
	 	leave_apply_model = '';	
	var response_data = {};
	 var todays_date 	= new Date(),
          curr_year     = todays_date.getFullYear(),
          curr_month    = todays_date.getMonth()+1;
    var   curr_date 	= todays_date.getFullYear()+"-"+utils.pad0(curr_month,2)+"-"+utils.pad0(todays_date.getDate(),2);  
    var   m_nofdays = 0.00;
	async.series([
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
			leave_apply.leave_apply_schema(connection,function(leave_apply_model_response){
				
				leave_apply_model = leave_apply_model_response;
				callback();
			})
		},
		function(callback)
		{   console.log('req.body :',req.body); 
			var key_value = req.body.id;
            var fieldlist = {
							leave_status : req.body.leave_status,					
						  	updated_by_user : req.body.loginUserId,						  
							updated_on_dtime :new Date()
							
							};
				
                        // req,res,key_value,option,limit,order,model,fieldlist  
			db_query.updateByPrimeryKey(req,res,key_value,{},{},{},leave_apply_model,fieldlist, function (err, data) 
	 		{ 			
	 		            //  console.log("data length :",data[0].length);	
	 		             
	 			  if (typeof data != 'undefined' && data != '' && data != null && data != 'error')
	 			  {
	 				  	response_data.leave_details =  data;
						callback();
				   }
					else
					{
						response_data.success = false;
						response_data.message = "Update leave status not successful";
						res.status(203).send({response_data});
					}
					 	
	 		});
	    },
	      function(callback)
		{       var upd_field=' ';
		       if (req.body.half_day_flag == 'Y')
			   {
				m_nofdays = 0.5;
        		}	
		      else
			   {
				m_nofdays = req.body.nofdays;
			   }
		        if (req.body.leave_type == 'CL')
		          {	
		        	upd_field='cl_avail=cl_avail - '+ m_nofdays;
		          }	
		        else  if (req.body.leave_type == 'EL')
		          {	
		        	upd_field='el_avail=el_avail -' + m_nofdays;
		          }
		        else  if (req.body.leave_type == 'ML')
		          {	
		        	upd_field='ml_avail=ml_avail -'+ m_nofdays;
		          }
		        else  if (req.body.leave_type == 'FL')
		          {	
		        	upd_field='flot_avail=flot_avail -'+ m_nofdays;
		          }  
		        else
		          {	
		        	upd_field='othe_avail=othe_avail -'+ m_nofdays;
		          } 
		        var condition = "'"+curr_date + "' between from_date  and  to_date and  emp_id="+ req.body.emp_id;	
				var sqlstring = "update "+ constant.LMS_LEAVE_AVAIL + " set "+ upd_field + " where " + condition;
           	      console.log('sqlstring upd avail :',sqlstring )                
			db_query.runQueryOnDb(req,res,sqlstring,connection,function (err, data)
			{    
				  if (data.changedRows == 1)
				 	{  
				 		
	 				 	response_data.details = data;
                
						callback();
					}
					else
					{
						response_data.success = false;
						response_data.message = "Leave avail Not Updated Successfully .";
						res.status(203).send({response_data});
					}
				});
	}],function(err) {
		response_data.success = true;
		response_data.message = "Leave Status and Leave avail Updated Successfully.!";
		res.status(200).send({response_data});
	});
});

module.exports = router;