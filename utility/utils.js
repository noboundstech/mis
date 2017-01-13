module.exports =
{
	'createAuthentication': function(req,res,data,next)          
	{
		var jwt 	= require('jsonwebtoken'),
			config 	= require('config/config');
			// check header or url parameters or post parameters for token
		// decode token

		console.log(data);
		console.log(config.secret);
		var token = jwt.sign(data, config.secret);
		next(token);
	
	},
	'checkAuthentication': function(req,res,next)          
	{
		var jwt 	= require('jsonwebtoken'),
			express = require('express'),
			config 	= require('config/config');
			// check header or url parameters or post parameters for token
		var token = req.body.token || req.param('token') || req.headers['x-access-token'] || req.query.token;
		// decode token
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token,config.secret, function(err, decoded) {			
				if (err) {
					var response_data = {};
					return res.status(203).send({ 
						success: false,
						response_data : {
											message: 'Please provide valid token.'
										}
					});
				//	return res.json({ success: false, message: 'Failed to authenticate token.',err :err });		
				} else {
					// if everything is good, save to request for use in other routes
					req.decoded = decoded;	
					next();
				}
			});
		} else {
			// if there is no token
			// return an error
			return res.status(203).send({ 
				success: false, 
				message: 'No token provided.'
			});
		}
	},
	'calc_date_diff_days': function(d1,d2)          
	{
		 
     var timeDiff  = Math.abs(d2.getTime() - d1.getTime());   
     var dayDiff   = Math.ceil(timeDiff / (1000 * 3600 * 24));		

		return dayDiff;
	
	},
	'calc_date_diff_months': function(d1,d2)          
	{
	      
     var monthdiff = d2.getMonth() - d1.getMonth() + (12 * (d2.getFullYear() - d1.getFullYear()));
		return monthdiff;
	
	},
	'pad0': function (str, max)
	{
	    str = str.toString();
       for (;str.length < max ;)
       {
       	str="0" + str;
       }
        return  str;
     
    },
    'ConvertDate' : function (datestr)
    {
      var d = new Date(datestr);
      d = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2);
        return d;
    },
	'getTableColumnType' : function(sql,type)
	{
		var constant = require("config/constant");
		if(type == constant.VARCHAR50)
		{
			return sql.VarChar(50);
		}
		if(type == constant.VARCHAR100)
		{
			return sql.VarChar(100);
		}
		if(type == constant.VARCHAR20)
		{
			return sql.VarChar(20);
		}
		if(type == constant.VARCHAR2)
		{
			return sql.VarChar(2);
		}
		if(type == constant.VARCHAR5)
		{
			return sql.VarChar(5);
		}
		if(type == constant.VARCHAR1)
		{
			return sql.VarChar(1);
		}
		if(type == constant.INT)
		{
			return sql.Int
		}
		if(type == constant.BIT)
		{
			return sql.Bit
		}
		if(type == constant.SMINT)
		{
			return sql.SMALLINT(2);
		}
		if(type == constant.DEC_10_6)
		{
			return sql.Decimal(10, 6);
		}
		if(type == constant.DATE_TIME)
		{
			return sql.datetime;
		}
		if(type == constant.BIGINT)
        {
            return sql.bigint;
        }
        if(type == constant.VARCHAR255)
        {
            return sql.VarChar(255);
        }
         if(type == constant.VARCHAR25)
        {
            return sql.VarChar(25);
        }
         if(type == constant.VARCHAR15)
        {
            return sql.VarChar(15);
        }
	}
}