module.exports = 
{
'user_access_schema': function(connection,callback)          
    {
        var mis_user_access_schema = connection.define("MIS_USER_ACCESS_LEVEL", {  
                      id     : Number,
                  emp_id     : Number,
                 del_flg     : String,
                 user_id     : String,
               user_type     : String,
          effective_date     : Date, 
        effective_status     : String,
        inserted_by_user     : String,
       inserted_on_dtime     : Date,
         updated_by_user     : String,
        updated_on_dtime     : Date            

        }, {id:"id"});
        callback(mis_user_access_schema);
    }
}