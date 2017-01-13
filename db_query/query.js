module.exports = {

	'findFromDb': function(req,res,condition,options,limit,order,model,callback)   
	{

	//Model.find([ conditions ] [, options ] [, limit ] [, order ] [, cb ])	
		model.find(condition,options,limit,order,function (err, data) 
 		{
 			if(err)
 			{
 				response_data.success = "error";
				response_data.message = err;
				res.status(501).send({response_data});
 			}
 			else
 			{
 				callback(err,data);
 			}
 		})
	},
	'runQueryOnDb': function(req,res,sqlstring,db,callback)   
	{
     var response_data = {};
	//Model.find([ conditions ] [, options ] [, limit ] [, order ] [, cb ])	
		db.driver.execQuery(sqlstring,function (err, data) 
 		{
 			if(err)
 			{
                console.log('err :',err)
 				response_data.success = "error";
				response_data.message = err;
				res.status(501).send({response_data});
 			}
 			else
 			{
 				callback(err,data);
 			}
 		})
	},
     //Model.create(items, cb)
	'insertToDb': function(req,res,fieldlist,model,callback)   
	{
      var response_data = {};
		model.create(fieldlist,function (err, data) 
 		{
 		
 			if(err)
 			{
 	
 				response_data.success = "error";
				response_data.message = err;
				res.status(501).send({response_data});
 			}
 			else
 			{
 				callback(err,data);
 			}
 		})
	},
	'updateByPrimeryKey': function(req,res,primary_key,options,limit,order,model,fieldlist,callback)   
	{
		model.get(primary_key,options,function (err, get_row) 
 		{ 
 			if(typeof get_row == 'undefined' || get_row == '')
 			{
 				callback(err,"error");
 			}
 			else
 			{
	 			var response_data = {};
 				for(key in fieldlist)
 				{
				    get_row[''+key+''] = fieldlist[key];
				}
 			//	get_row.save(fieldlist,function(saverr,data)
 				get_row.save(function(saverr,data)	
 				{
	 				if(saverr)
	 			    {   
						response_data.success = "error";
						response_data.message = saverr;
						res.status(501).send({response_data});
					}
					else
					{
					 	callback(saverr,data);
					} 
				})
	 		}
 		})
	},
	'updateByCondition': function(req,res,condition,options,limit,order,model,fieldlist,callback)   
	{
		model.find(condition).each(function (err,update_row) {
			var response_data = {};
 			if(err)
 			{
             
 				response_data.success = "error";
				response_data.message = err;
				res.status(501).send({response_data});
 			}
 			else
 			{
		   		for(key in fieldlist){
				    update_row[''+key+''] = fieldlist[key];
				}
			}
		}).save(function (saverr) {
		    if(saverr)
			{
				response_data.success = "error";
				response_data.message = saverr;
				res.status(501).send({response_data});
			}
			else
			{
				callback(saverr,data);
			} 
		});
	},
	'removeByPrimaryKey': function(req,res,primary_key,options,limit,order,model,fieldlist,callback)   
	{
		model.get(primary_key,options,function (err, get_row) 
 		{ 
 			
 			var response_data = {};
 			if(err)
 			{
         
 				response_data.success = "error";
				response_data.message = err;
				res.status(501).send({response_data});
 			}
 			else
 			{
 				get_row.remove(fieldlist,function(saverr,data)
 				{
	 				if(saverr)
	 			    {
						response_data.success = "error";
						response_data.message = saverr;
						res.status(501).send({response_data});
					}
					else
					{
					 	callback(saverr,data);
					} 
				})
 			}
 			  
 		})
	}
};