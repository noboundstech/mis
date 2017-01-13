module.exports = 
{
'admin_user_schema': function(connection,callback)          
    {
        var mis_user_schema = connection.define("MIS_USER", {   
            user_id                 : String,
            user_pwd                : String,
            emp_id                  : Number,
            mgr_emp_id              : Number,
            activated_on_date       : Date,
            active_status           : String,
            active_status_reason    : String,
            email_id                : String,
            last_signin_datetime    : Date,
            inserted_by_user        : String,
            inserted_on_dtime       : Date,
            updated_by_user         : String,
            updated_on_dtime        : Date  
        }, {id:"user_id"});
        callback(mis_user_schema);
    }
}
