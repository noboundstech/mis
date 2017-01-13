module.exports = 
{
	'db_connect': function(req,res,db_callback)          
	{
		var callback = db_callback
		var config = require('config/config');
		var orm = require("orm");
		var conn_string = config.db_type+"://"+config.db_user+":"+config.db_password+"@"+config.db_server+"/"+config.db_database;
		orm.connect(conn_string, function (err, db_connection) {
			if(err)
 			{
 				var response_data = {}; 
 				response_data.success = "error";
				response_data.message = err;
				res.status(503).send({response_data});
 			}
 			else
 			{
 		        callback(err,db_connection);

 			}

			
		});
	}
}
