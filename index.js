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
var ueditor=require('ueditor');
var showPost=require('./routers/showPost');
var start=require('./routers/start');
var upload=require('./routers/upload');
var ip=require('./util/ip');
global.mongoose=require('./lib/vcMongoose').mongoose;
global.conn=require('./lib/vcMongoose').conn;

var routers={};
routers=require('./routers');
routers.list=require('./routers/list');
routers.news=require('./routers/news');
routers.common=require('./routers/common');

var app=express();

var swig=require('swig');
app.set('view engine','html');
app.engine('html',swig.renderFile);

app.set('ip',ip());
app.set('port',process.env.PORT||8888);
app.set('views',__dirname+'/views');
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'plugins')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
	resave:true,
	saveUninitialized:false,
	secret:'demo'
}));
app.use('/ueditor/ue',ueditor(path.join(__dirname,'public'),function(req,res,next){
	if(req.query.action==='uploadimage'){
		var foo=req.ueditor;
		console.log(foo.filename);
		console.log(foo.encoding);
		console.log(foo.mimetype);

		var imgname=req.ueditor.filename;

		var img_url='/images/ueditor/';
		res.ue_up(img_url);
	}
	else if(req.query.action==='listimage'){
		var dir_url='/images/ueditor/';
		res.ue_list(dir_url);
	}
	else{
		res.setHeader('Content-Type','application/json');
		res.redirect('/ueditor/ueditor.config.json');
	}
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

//set controller
var vcNews=require('./controllers/vcNews');
var vcCommon=require('./controllers/vcCommon');
var vcUsers=require('./controllers/vcUsers');

var navTags=function(){
	vcNews.findAllTags(function(vc){
		var navs=vc.toString().split(',');
		app.set('navTags',navs);
		global.navTags=app.get('navTags');
	});
}();

//routers

app.post('/showPost',showPost);
app.get('/start',start);
app.post('/upload',upload.upload);
app.post('/uploadProgress',upload.uploadProgress);
app.post('/model',function(req,res){
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


app.get('/',routers.index);
app.get('/list',routers.list.list);
app.get('/list/:tag',routers.list.listTag);
app.get('/news/:id',routers.news.news);
app.get('/profile',routers.common.profile);
app.get('/contact',routers.common.contact);


app.get('/webSocket',function(req,res){
	console.log('session.user : '+req.session.user);
	if(!req.session.user){
		res.render('webSocket',{ip:app.get('ip'),port:app.get('port'),title:'socket.io',isLogin:0,name:'""',navs:app.get('navTags')});
	}else{
		res.render('webSocket',{ip:app.get('ip'),port:app.get('port'),title:'socket.io',isLogin:1,name:'"victorchung"',navs:app.get('navTags')});
	}
});
//add name to chat
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


function isLogin(req,res,next){
	if(!req.session.user){
		res.redirect('/ad/login');
	}
	else{
		next();
	}
}


/* dir /ad */
app.get('/ad/login',function(req,res){
	res.render('ad/login',{});
});
app.post('/ad/login',function(req,res){
	if(req.body.name.toLowerCase()=='victorchung'&&req.body.pwd==1){
		req.session.user=req.body.name.toLowerCase();
		res.json({ret:1});
	}
	else{
		res.json({ret:0});
	}
});
app.get('/ad/list',isLogin,routers.list.adList);
//进入添加界面
app.get('/ad/addnews',isLogin,routers.news.adNews);
//进入编辑界面
app.get('/ad/addnews/:id',isLogin,routers.news.adGetNews);
//添加文章
app.put('/ad/addnews',isLogin,routers.news.adPutNews);
//修改文章
app.post('/ad/addnews',isLogin,routers.news.adPostNews);
//删除文章
app.delete('/ad/list',isLogin,routers.news.adDeleteNews);
app.get('/ad/profile',isLogin,routers.common.adProfile);
app.post('/ad/profile',isLogin,routers.common.adPostProfile);
app.get('/ad/contact',isLogin,routers.common.adContact);
app.post('/ad/contact',isLogin,routers.common.adPostContact);

app.get('*',function(req,res){
	res.end('404');
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
