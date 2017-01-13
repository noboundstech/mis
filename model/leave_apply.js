module.exports = 
{
'leave_apply_schema': function(connection,callback)          
    {
        var mis_leave_apply_schema = connection.define("MIS_EMP_LEAVE_APPLY", {
                      id        : Number,  
                 del_flg        : String,
               from_date        : Date ,
                 to_date        : Date ,
                  emp_id        : Number,
              leave_type        : String,
                 nofdays        : Number,
              mgr_emp_id        : Number,
            leave_status        : String,
           half_day_flag        : String,
      approved_by_emp_id        : Number,
        inserted_by_user        : String,
       inserted_on_dtime        : Date,  
         updated_by_user        : String,
        updated_on_dtime        : Date
                               
        }, {id:"id"});
        callback(mis_leave_apply_schema);
    }
}