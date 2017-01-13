var nodemailer 	= require('nodemailer'),
	config 		= require('config/config.js');
module.exports.send_mail = function(to_mail,subject,body)
{
    // create reusable transporter object using the default SMTP transport 
    var transporter = nodemailer.createTransport('smtps://'+config.email_user+':'+config.email_password+'@'+config.email_host);
    // setup e-mail data with unicode symbols 
    var mailOptions = {
        from        : config.email_from+'<'+config.email_user+'>', // sender address 
        to          : to_mail, // list of receivers 
        subject     : subject, // Subject line 
        text        : '', // plaintext body 
        html        : body // html body 
    };
    // send mail with defined transport object 
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
    });
}