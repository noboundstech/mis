module.exports =
{
	'validateSignin': function(req,res,callback)          
	{
		var validate_success = 1;
		var error_message =''
		if(typeof req.body.username =='undefined' || req.body.username =='' || req.body.username ==null)
		{
			error_message = "Please provide username";
			validate_success = 0;
		}
		if(typeof req.body.password =='undefined' || req.body.password =='' || req.body.password ==null)
		{
			error_message = "Please provide password";
			validate_success = 0;
		}
		if(validate_success ==0) // if validation is unsuccessful
		{
			res.status(203).send({  "status"        : false,
                                    "error_type"    : "validate error",
                                    "response_data" : {
                                                        "message"       : error_message

                                                    }
                                });
		}
		else
		{
			// if validation 
			callback();
		}
	},
    'validateForgetPassword': function(req,res,callback)          
    {
        var validate_success = 1;
        var error_message =''
        if(typeof req.body.email =='undefined' || req.body.email =='' || req.body.email ==null)
        {
            error_message = "Please enter your Email Id.";
            validate_success = 0;
        }
       
        if(validate_success ==0) // if validation is unsuccessful
        {
            res.status(203).send({  "status"        : false,
                                    "error_type"    : "validate error",
                                    "response_data" : {
                                                        "message"       : error_message

                                                    }
                                });
        }
        else
        {
            // if validation 
            callback();
        }
    },

	
	'ValidateApplyLeave' : function(req,res,callback)         
    {
        var validate_success = 1;
        var error_message ='';
   
       
        if( typeof req.body.from_date =='undefined' || req.body.from_date =='' || req.body.from_date ==null)

        {
            error_message = "undefined or blank or null incoming  From date";
            validate_success = 0;
        }
        if( typeof req.body.to_date =='undefined' || req.body.from_date =='' || req.body.to_date ==null)

        {
            error_message = "undefined or blank or null incoming To_date ";
            validate_success = 0;
        }
         if( typeof req.body.leave_Manager=='undefined'  || req.body.leave_Manager ==null)
         {
            error_message = "undefined or blank or null Manager ";
            validate_success = 0;
         }
        if(validate_success ==0) // if validation is unsuccessful
        {
                        response_data.success = false;
                        response_data.message = error_message;
                        res.status(203).send({response_data});
         //   res.status(203).send({    "status"         : false,
         //                           "error_type"     : "validate error",
         //                           "message"         : error_message
         //                       });
        }
        else
        {
            // if validation
            callback();
        }
    },
  
    'ValidateAddUser' : function(req,res,callback)         
    {
        var validate_success = 1;
        var error_message ='';
       
        if( typeof req.body.add_user_id =='undefined' || req.body.add_user_id =='' || req.body.add_user_id ==null)
        {
            error_message = "Please add user name.";
            validate_success = 0;
        }
        if( typeof req.body.password =='undefined' || req.body.password =='' || req.body.password ==null)
        {
            error_message = "Please Enter user password.";
            validate_success = 0;
        }
        
         if( typeof req.body.email_id =='undefined' || req.body.email_id =='' || req.body.email_id ==null)
        {
            error_message = "Please add Email id ";
            validate_success = 0;
        }
        if(validate_success ==0) // if validation is unsuccessful
        {
           
            res.status(203).send({   "status"         : false,
                                    "error_type"     : "validate error",
                                    "message"         : error_message
                                });
        }
        else
        {
            // if validation
            callback();
        }
    },
     'ValidateUpdateUser' : function(req,res,callback)         
    {
        var validate_success = 1;
        var error_message ='';
        if( typeof req.body.active_status =='undefined' || req.body.active_status =='' || req.body.active_status ==null)
        {
            error_message = "Please select user active status.";
            validate_success = 0;
        }
        if( typeof req.body.active_status_reason =='undefined' || req.body.active_status_reason =='' || req.body.active_status_reason ==null)
        {
            error_message = "Please Select User active status reason.";
            validate_success = 0;
        }
        if( typeof req.body.email_id =='undefined' || req.body.email_id =='' || req.body.email_id ==null)
        {
            error_message = "Please Enter email Id.";
            validate_success = 0;
        }
        if( typeof req.body.user_pwd =='undefined' || req.body.user_pwd =='' || req.body.user_pwd ==null)
        {
            error_message = "Please Enter user password.";
            validate_success = 0;
        }
        if( typeof req.body.user_id =='undefined' || req.body.user_id =='' || req.body.user_id ==null)
        {
            error_message = "Please add user name.";
            validate_success = 0;
        }

        if(validate_success ==0) // if validation is unsuccessful
        {
           
            res.status(203).send({   "status"         : false,
                                    "error_type"     : "validate error",
                                    "message"         : error_message
                                });
        }
        else
        {
            // if validation
            callback();
        }
    }
};