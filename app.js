'use strict';
var express     = require("express"), // the framework which we are using for nodejs
    path        = require('path'), //The path module provides utilities for working with file and directory paths
    app         = express(),
    compression = require('compression'), //The middleware will attempt to compress response bodies for all request that traverse through the middleware
    helmet      = require('helmet'), // Helmet helps you secure your Express apps by setting various HTTP headers. 
    config      = require('./config/config'), //where we will keep all the configuration file
    morgan      = require('morgan'),  //HTTP request logger middleware for node.js
    bodyParser  = require('body-parser'),
    router      = express.Router(); //Parse incoming request bodies in a middleware before your handlers, availabe under the req.body property
// my middleware start here
app.set('superSecret', config.secret); // secret variable
app.use(bodyParser.urlencoded({ extended: true,limit: '200mb' })); 



//app.use(bodyParser.json({limit: '5mb'})); // parse application/vnd.api+json as json 
app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));
app.use(compression());
app.use(helmet());
/*The X-XSS-Protection HTTP header is a basic protection against XSS. 
    It was originally by Microsoft but Chrome has since adopted it as well. 
    Helmet lets you use it easily:
*/
app.use(helmet.xssFilter());
// Don't allow me to be in ANY frames: 
app.use(helmet.frameguard({ action: 'deny' }))
 
// Only let me be framed by people of the same origin: 
app.use(helmet.frameguard({ action: 'sameorigin' }))
app.use(helmet.frameguard())  // defaults to sameorigin 
 
app.use(helmet.hsts({
  maxAge: 10886400000,     // Must be at least 18 weeks to be approved by Google 
  includeSubdomains: true, // Must be enabled to be approved by Google 
  preload: true
}))

// ALWAYS set the header 
app.use(helmet.hsts({
  maxAge: 1234000,
  force: true
}))
app.use(function (req, res, next) {
   // add details of what is allowed in HTTP request headers to the response headers
   // res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', '*');
   // res.header('Access-Control-Allow-Credentials', false);
    res.header('Access-Control-Max-Age', '586400');
    res.header('Access-Control-Allow-Headers', '*');
    // the next() function continues execution and will move onto the requested URL/URI
    next();
});
// adding middleware for nodejs crawl
//app.use(require('prerender-node').set('prerenderToken', 'RQ5GW4Vh2N7prQ1f3FIc'));
// to load angularjs
app.use(express.static(path.join(__dirname, 'public')));



/*
var mysql = require('mysql');
var connection= mysql.createConnection({
    user: 'root',
    password: 'misdev01',
    host  : 'localhost',
    database: 'misdata'
});
connection.connect(function(err) {
      if (err) {
          console.error('error connecting: ' + err.stack);
          return;
      }
    });
*/






//app.use(express.static(path.join(__dirname, 'Neighborhood_friend')));
// to open pdf of the agreement
//app.use('/pdf', express.static(__dirname + '/pdf'));

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

var users = {};
var total_user ={};
var total_csr = [];
var socket_details = '';

function findNewCsrForConnection(data,users,total_user,total_csr,socket,csr_id,callback){
  var _ = require('lodash');

  // checking if any other csr is present or not
  if(total_csr.length ==0)
  {
    callback({status : false, message : "No active csr is present now please try after sometime."});
  }
  else
  {
    // shuffling all csr so that a random csr get selected each time
    total_csr = _.shuffle(total_csr);
    var found_new_csr = 0;

    for(var i=0;i<total_csr.length;i++)
    {
      if(total_user[total_csr[i]] < 4 )
      {
        var utils = require("utility/utils");
        var response_data = {};
        var res = {};
        var req = {
                      body : {
                                id          : data.id,
                                member_id   : "",
                                lat         : "",
                                longitude   : "",
                                csrId       : total_csr[i]
                              }
                  };
        utils.CalladdChatHeader(req,res,response_data,function(){
           var details = {
                        id              : data.id,
                        image           : "img/user.png",
                        notification    : 0,
                        name            : "Kennedy john"+data.id ,
                        last_login      : "0 min",
                        chat_header     : response_data.details[0].max_header_id,
                        offer_history   : [{
                                  date : "10/3/2016",
                                  time : "9.30 A.M",
                                  offer_name : "Lorem Ipsum"
                                }],
                        location      :{
                                  latitude : "22.573531",
                                  longitude : "88.433119",
                                },
                      };
          socket.unique_id =  data.id;
          socket.csr_id   = total_csr[i];
          socket.chat_header_id = '';
          total_user[total_csr[i]]+=1;
          socket.cust_id   = data.id;
          socket.chat_header_id = response_data.details[0].max_header_id;
          users[socket.unique_id] = socket;
          found_new_csr = 1;
          users[total_csr[i]].emit("new customer added",details);
          users[socket.unique_id].emit("make_connection_with_csr",total_csr[i]);
        })
        
        // i.e called an api to we chat
       
        break;
      }
    }
  }
}

app.io = io.sockets.on("connection",function(socket){
  // socket get open when any new user get login into chat system
  socket.on('new user',function(data,callback){
    // if user already holding any old connection
    if(data.id in users)
    {
      // if he is already in active session
      if(data.type == 'csr')
      {
        callback({status : false,connect_by : "csr", message : "please close your previous session by closing your previous browser where you signin."});
      }
      else
      {
        callback({status : false,connect_by : "customer", message : "please close your previous session by closing your previous browser where you signin."});
      }
    }
    else
    {

      // creating connection for csr
      if(typeof data.type != 'undefined' && data.type != '' && data.type != null && data.type == 'csr')
      {
          socket.unique_id        = data.id;
          socket.csr_id           = data.csr;
          total_user[data.id]     = 0;
          socket.cust_id          = "csr";
          users[socket.unique_id] = socket;
          total_csr.push(data.id);
      }
      else // creating socket connection for customer
      {
        if(data.csr == 'find_new_csr')
        {
          // making new socket connection with the csr
          findNewCsrForConnection(data,users,total_user,total_csr,socket,data.csr,callback);
        }
        else
        {
          if(typeof users[data.csr] == 'undefined')
          {
            callback({status : false, message : "csr is not present would you like to continue with another csr."});
            //findNewCsrForConnection(data,users,total_user,total_csr,socket,'find_new_csr',callback);
          }
          else
          {
            var details = {
                        id              : data.id,
                        image           : "img/user.png",
                        notification    : 0,
                        name            : data.id ,
                        last_login      : "0 min",
                        chat_header     : users[data.chat_header_id],
                        offer_history   : [{
                                  date : "10/3/2016",
                                  time : "9.30 A.M",
                                  offer_name : "Lorem Ipsum"
                                }],
                        location      :{
                                  latitude : "22.573531",
                                  longitude : "88.433119",
                                },
                      };
            users[data.csr].emit("new customer added",details);
          }
        }
      }
    }
    socket_details = socket;
  });
  socket.on("send message",function(data){
    data.date = new Date();
    data.typeofdata = "TX";
    if(typeof data.converseby == 'undefined')
    {
      data.converseby = "CU";
    }
    if(data.cust_id in users)
    {
      if(typeof users[data.cust_id] !="undefined")
      {
        console.log(data.csr_id,"csr id");
      //  console.log(users[data.cust_id],"customer details");
    //    console.log( users[data.csr_id],"csr details")
        if(data.converseby !='CS')
        {
          users[data.cust_id].emit("new message",data);
        }
      }
      if(typeof users[data.csr_id] !="undefined")
      {
        users[data.csr_id].emit("new message",data);
      }
    }
    else
    {
      // this is if only csr is in socket
      if(typeof users[data.csr_id] != 'undefined')
      {
        users[data.csr_id].emit("new message",data);
      }
    }
  });
  socket.on('disconnect',function(data){
    if(!socket.unique_id)
    {

    }
    else
    {
      if(socket.cust_id != 'csr')
      {
        if(typeof total_user[socket.csr_id] != 'undefined')
        {
           // i.e called an api to we chat
          users[socket.csr_id].emit("exit_connection_with_csr",socket.unique_id);
          if(typeof total_user[socket.csr_id] != 'undefined')
          {
            if(total_user[socket.csr_id]>0)
            {
              total_user[socket.csr_id]-=1;
            }
          }
        }
      }
      else
      {
        delete total_user[socket.csr_id];
        var index = total_csr.indexOf(socket.csr_id);
        if (index > -1) {
            total_csr.splice(index, 1);
        }
         // i.e called an api to we chat where we have to remove connection from csr 
      }
      delete users[socket.unique_id];
    }
    socket_details = socket;
  });
  
})










// a node scheduler which will look for new message comming from wechat
var schedule = require('node-schedule');
  var j = schedule.scheduleJob('*/20 * * * * *', function(){

    /*
    var data = { csr_id: 'Firdous',
                sender_id: 'firdous',
                message: 'hello man ',
                cust_id: ':WE0001' 
              };
    if(typeof users[data.csr_id] != 'undefined' && users[data.csr_id] != null)
    {
      users[data.csr_id].emit("new message",data);
    }
    */
  });
require('./routes/routes.js')(app);
/*
app.get('/*', function(req, res) {
res.sendFile(path.join(__dirname + '/public/index.html'));
});
*/

module.exports = app;