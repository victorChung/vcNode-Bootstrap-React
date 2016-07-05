'use strict';

var express=require('express');
var fs=require('fs');
var url=require('url');
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var session=require('express-session');
var favicon=require('serve-favicon');
var logger=require('morgan');
var path=require('path');
var routers=require('./routers');
var showPost=require('./routers/showPost');
var start=require('./routers/start');
var upload=require('./routers/upload');
var ip=require('./util/ip');

var app=express();

var swig=require('swig');
app.set('view engine','html');
app.engine('html',swig.renderFile);

app.set('ip',ip());
app.set('port',process.env.PORT||8888);
app.set('views',__dirname+'/views');
//app.use('/',route);
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
	resave:true,
	saveUninitialized:false,
	secret:'demo'
}));

app.use(function(req,res,next){
	next();
});
//app.use('/',routers.index);

var server=app.listen(app.get('port'),function(){
	console.log('server started on ip : '+app.get('ip')+':'+app.get('port'));
});
//var socketIO=require('./lib/vcSocket')(server);
var socketIO=require('./lib/vcSocket');
socketIO=socketIO(server);


app.get('/',routers.index);
app.post('/showPost',showPost);
app.get('/start',start);
app.post('/upload',upload.upload);
app.post('/uploadProgress',upload.uploadProgress);
app.get('/list',function(req,res){
	var vcNews=require('./controllers/vcNews');
	vcNews.findAll(res);
});
app.post('/model',function(req,res){
	var vcNews=require('./controllers/vcNews');
	vcNews.findAll(res);
});
app.get('/test',function(req,res){
	res.render('test',{});
});
app.get('/serverSentEvent',function(req,res){
	res.writeHead(200,{'content-Type':'text/event-stream'});
	var dd=new Date();
	//下面语句一定要两个换行
	res.end("data: "+dd+'\n\n');
});


app.get('/testWebSocket',function(req,res){
	res.render('testWebSocket',{ip:app.get('ip'),port:app.get('port')});
});

app.get('/webSocket',function(req,res){
	if(!req.session.user){
		res.render('webSocket',{ip:app.get('ip'),port:app.get('port'),title:'socket.io',isLogin:false});
	}else{
		res.render('webSocket',{ip:app.get('ip'),port:app.get('port'),title:'socket.io',isLogin:true});
	}
});
app.post('/webSocket',function(req,res){
	console.log('name : '+req.body.name);
	var ret=1;
	for(var i in socketIO){
		if(socketIO[i].name==req.body.name){
			ret=0;
			break;
		}
	}
	res.json({ret:ret});
});
/*
if(app.get('env')==='development'){
	app.use(function(err,req,res,next){
		res.status(err.status||500);
		res.end('\neeeerrrroooorrrrr\n');
	});
}
*/
module.exports=app;
