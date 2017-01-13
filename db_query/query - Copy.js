module.exports = {
 'selectFromDb': function(req,res,condition,selection,table,data,callback)   
{
	
    var orm = require("orm");
 
	orm.connect("mysql://root:misdev01@localhost/misdata", function (err, db) {
  		if (err) throw err;
  		console.log(db,"connection string");

  		var mis_user_schema = db.define("MIS_EMP_EDU", {

						//	id : { type: 'number',key:true},
						    id : Number,
							emp_id : Number,
							del_flg : String,
							edu_degree_name : String,
							edu_institution_name : String

  			/*ue
					        user_id  				:  { type: 'String' , id : true},
					        user_pwd 				: String,
					        emp_id   				: Number,
					        mgr_emp_id 				: Number,
					        activated_on_date 		: Date,
					        active_status 			: String,
					        active_status_reason	: String,
					        email_id 				: String,
					        last_signin_datetime 	: Date,
					        inserted_by_user 		: String,
					        inserted_on_dtime 		: Date,
					        updated_by_user 		: String,
					        updated_on_dtime 		: Date	

			*/
					    });
  		 // add the table to the database 
    	db.sync(function(err) {
        if (err) throw err;
	  		var get = '';

	  		console.log(get);
	 		mis_user_schema.find({del_flg :"Y"}, function (err, data) 
	 		{
	 			for(i=0;i<data.length;i++)
	 			{
	 				console.log(data[i].edu_institution_name,"name");
	 			}

	 			console.log(err,"error");
	 			console.log(data,"data");
	 		});
	 	});
 	})
 /*
    console.log('point1')
    orm.connect(connection,function(err,db){
      if (err) {
                console.log('error connecting: ',  err);
                return;
            }
        });
    console.log('point2')
  var mis_user_schema = db.define(constant.USER_MASTER, {
        user_id  : constant.VARCHAR15,
        user_pwd : constant.VARCHAR25,
        emp_id   : constant.SMINT,
        mgr_emp_id : constant.SMINT,
        activated_on_date : constant.DATE_TYPE,
        active_status :constant.VARCHAR8,
        active_status_reason : constant.VARCHAR25,
        email_id : constant.VARCHAR70,
        last_signin_datetime : constant.DATE_TIME,
        inserted_by_user :constant.VARCHAR25,
        inserted_on_dtime : constant.DATE_TIME,
        updated_by_user : constant.VARCHAR25,
        updated_on_dtime : constant.DATE_TIME
    });
console.log('point3')
mis_user_schema.find({ user_id: "aparna" }, "user_id", function (err, data) 
 {
	if (err)
	{
	 console.log('point4')	
     return err;
	}
	else
	{
	console.log('point5');	
     console.log('data :' data);
	}


 }); 
*/
},       
	/*{
		var connection = require('config/db_connection').db_connect();

		connection.connect(function(err) {
			if (err) {
			    console.error('error connecting: ' + err.stack);
			    return;
			}
		});

		var utils = require('utility/utils');
		var sql = require('mysql');
	//	var connection1 = new sql.Connection(config, function(err) {
			//console.log(err);
	//		var request = new sql.Request(connection1); // or: var request = connection1.request();
			
			if(condition.length>0)
			{
				var where = ' WHERE ';
			}
			else
			{
				var where = '';
			}
			for(i=0;i<condition.length;i++)
			{
				
				var type = utils.getTableColumnType(sql,condition[i].type);
			   	request.input(condition[i].name,type,condition[i].value);
			    where+=" "+condition[i].name +" = @"+condition[i].name;
				if(i<condition.length-1)
				{
					where+= " AND ";
				}
			}
			var query = 'select '+selection+' FROM dbo.'+table+' '+where;
		   	connection.query(query).then(function(recordset) {
	    		data.details = recordset;
	    		callback();
	    		connection.close();
		    }).catch(function(err) {
		    	console.log(err)
		    	//res.send({data : err});
		    	connection.close();
		        // ... query error checks 
		    });
		//});


	},*/
	'RunSelSqlFromDb': function(req,res,sqlstring,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection');
		var connection1 = new sql.Connection(config, function(err) {
			//console.log(err);

			var request = new sql.Request(connection1); // or: var request = connection1.request();
		
			var query = sqlstring ;
		    //request.query('SELECT '+selection+' FROM '+table+'where userId=1').then(function(recordset) {
		   //request.query('SELECT '+selection+' FROM '+table+' where '+condition).then(function(recordset) {
		   	request.query(query).then(function(recordset) {
        		data.details = recordset;
            		callback();
        		connection1.close();
		    }).catch(function(err) {
		    	console.log(err)
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
		    
		});
	
	},
	'insertToDb': function(req,res,condition,fieldlist,table,data,callback)         
    {
        var sql = require('mssql');
        var config = require('config/db_connection')
        var utils = require('utility/utils');
        var connection1 = new sql.Connection(config, function(err) {
            //console.log(err);
            var request = new sql.Request(connection1); // or: var request = connection1.request();
       
            if(condition.length>0)
            {
                var where = ' WHERE ';
            }
            else
            {
                var where = '';
            }

            for(i=0;i<condition.length;i++)
            {
               
                var type = utils.getTableColumnType(sql,condition[i].type);

                   request.input(condition[i].name,type,condition[i].value);
                where+=" "+condition[i].name +" = @"+condition[i].name;
                if(i<condition.length-1)
                {
                    where+= " AND ";
                }
            }
            var vallist= '(';
            var flist='(';
            for(i=0;i<fieldlist.length;i++)
            {
               
            //    var type2 = utils.getTableColumnType(sql,fieldlist[i].type);
            //       request.input(fieldlist[i].varname,type2,fieldlist[i].value);
            //       vallist+="@"+fieldlist[i].varname;
                 flist+=fieldlist[i].name;
               if (fieldlist[i].varname != "SYSDATETIME()")
                 {
                   var type2 = utils.getTableColumnType(sql,fieldlist[i].type);   
 
                   request.input(fieldlist[i].varname,type2,fieldlist[i].value);   
                  vallist+="@"+fieldlist[i].varname;
                 } 
                else 
                 {   

                    vallist+=fieldlist[i].varname;
                 }  

              
                if(i< fieldlist.length-1)
                {
                    flist+= ",";
                    vallist+= ",";
                }
            }
   
            var query = 'insert into '+table+' '+flist+') values'+vallist +') '+where;
               request.query(query).then(function(err,recordset) {
                data.details = request.rowsAffected;
                callback();
                connection1.close();
            }).catch(function(err) {
                console.log(err)
                //res.send({data : err});
                connection1.close();
                // ... query error checks
            });
        });
    },
    'MultiInsertToDb': function(req,res,vallist,fieldlist,table,data,callback)         
    {
        var sql = require('mssql');
        var config = require('config/db_connection')
        var utils = require('utility/utils');
        var connection1 = new sql.Connection(config, function(err) {
            //console.log(err);
            var request = new sql.Request(connection1); // or: var request = connection1.request();
                     
            var query = 'insert into '+table+' '+fieldlist+' values '+vallist ;
            console.log('query :',query)
               request.query(query).then(function(err,recordset) {
                data.details = request.rowsAffected;
                callback();
                connection1.close();
            }).catch(function(err) {
                console.log(err)
                //res.send({data : err});
                connection1.close();
                // ... query error checks
            });
        });
    },
	'updateToDb': function(req,res,condition,fieldlist,table,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection')
		var utils = require('utility/utils');
		var connection1 = new sql.Connection(config, function(err) {
			//console.log(err);
			var request = new sql.Request(connection1); // or: var request = connection1.request();
				
			if(condition.length>0)
			{
				var where = ' WHERE ';
			}
			else
			{
				var where = '';
			}
		
			for(i=0;i<condition.length;i++)
			{
				
				var type = utils.getTableColumnType(sql,condition[i].type);

			   	request.input(condition[i].name,type,condition[i].value);
			    where+=" "+condition[i].name +" = @"+condition[i].name;
				if(i<condition.length-1)
				{
					where+= " AND ";
				}
			}
			var flist='';
			for(i=0;i<fieldlist.length;i++)
			{
				
											   
			   	if (fieldlist[i].varname != "SYSDATETIME()")
                 {
                   var type2 = utils.getTableColumnType(sql,fieldlist[i].type);	
  
                   request.input(fieldlist[i].varname,type2,fieldlist[i].value);	
			       flist+=fieldlist[i].name +'='+ "@"+fieldlist[i].varname;
			     }  
			    else  
			     {	

			        flist+=fieldlist[i].name +'='+fieldlist[i].varname;
			     }   
			    if(i< fieldlist.length-1)
				{
					flist+= ",";
				}
			}
		
			var query = 'update '+table+' set '+flist+' '+where;
		   	request.query(query).then(function(recordset) {
		    
	    		data.details = request.rowsAffected;
	    
              		callback();
	    		connection1.close();
		    }).catch(function(err) {
		    	console.log(err)
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
		});
	},
	'deleteFromDb': function(req,res,condition,table,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection')
		var utils = require('utility/utils');
		var connection1 = new sql.Connection(config, function(err) {
			//console.log(err);
			var request = new sql.Request(connection1); // or: var request = connection1.request();
			if(condition.length>0)
			{
				var where = ' WHERE ';
			}
			else
			{
				var where = '';
			}
			for(i=0;i<condition.length;i++)
			{
				
				var type = utils.getTableColumnType(sql,condition[i].type);

			   	request.input(condition[i].name,type,condition[i].value);
			    where+=" "+condition[i].name +" = @"+condition[i].name;
				if(i<condition.length-1)
				{
					where+= " AND ";
				}
			}
			
			var query = 'delete from '+table+' '+ where;

		   	request.query(query).then(function(result) {
		    
	    		data.details = result;
	    		callback();
	    		connection1.close();
		    }).catch(function(err) {
		    	console.log(err)
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
		});
	}
};