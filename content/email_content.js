module.exports.forget_password = function(data)                     
{
  	var email_content   = 	'Hi '+data.userRole+',<br/><br/> below are the details of your login credential<br/><br/>'+
                            "User Name :  "+data.userName+"<br> <br/>"+
                            "Password : "+data.userPwd+"<br><br><br><br><br "+
							'Thanks <br><br>Team Master Card ';
    var body	= email_content;      
    var subject = "Forget Password. ";             
    var data    = {body: body,subject:subject};                 
    return data;                                       
}