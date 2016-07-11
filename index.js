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
var routers=require('./routers');
var showPost=require('./routers/showPost');
var start=require('./routers/start');
var upload=require('./routers/upload');
var ip=require('./util/ip');
global.mongoose=require('./lib/vcMongoose').mongoose;
global.conn=require('./lib/vcMongoose').conn;

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

app.get('/',routers.index);
app.post('/showPost',showPost);
app.get('/start',start);
app.post('/upload',upload.upload);
app.post('/uploadProgress',upload.uploadProgress);
app.get('/list',function(req,res){
	vcNews.findAll(function(docs){
		res.render('list',{title:'list',items:docs,navs:app.get('navTags')});	
	});
});
app.get('/list/:tag',function(req,res){
	var tag=req.params.tag;
	console.log(':tag : '+JSON.stringify(req.url));
	var breads=[{
		name:'Articles',
		url:'/list'
	},
	{
		name:tag,
		url:req.url
	}];
	vcNews.findbyTags(new Array(tag),function(docs){
		res.render('list',{title:tag,items:docs,tag:tag,navs:app.get('navTags')});
	});
});
app.get('/news/:id',function(req,res){
	vcNews.findbyId(req.params.id,function(docs){
		vcNews.findbyTags(docs.tags,function(vc){
			var editTime=docs.editTime.toLocaleString();
			res.render('news',{title:docs.title,content:docs.content,author:docs.author,tags:docs.tags,editTime:editTime,items:vc,navs:app.get('navTags')});
		});
	});	
});
app.get('/profile',function(req,res){
	vcCommon.findbyName('profile',function(docs){
		res.render('common',{title:docs.title,content:docs.content,navs:app.get('navTags')});
	});
});
app.get('/contact',function(req,res){
	vcCommon.findbyName('contact',function(docs){
		res.render('common',{title:docs.title,content:docs.content,navs:app.get('navTags')});
	});
});
app.post('/model',function(req,res){
	//var vcNews=require('./controllers/vcNews');
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
	console.log('session.user : '+req.session.user);
	if(!req.session.user){
		res.render('webSocket',{ip:app.get('ip'),port:app.get('port'),title:'socket.io',isLogin:0,name:'""',navs:app.get('navTags')});
	}else{
		res.render('webSocket',{ip:app.get('ip'),port:app.get('port'),title:'socket.io',isLogin:1,name:'"victorchung"',navs:app.get('navTags')});
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
app.get('/ad/list',function(req,res){
	if(!req.session.user)res.redirect('/');
	vcNews.findAll(function(docs){
		res.render('ad/list',{items:docs,navs:app.get('navTags')});	
	});
});
app.get('/ad/addnews',function(req,res){
	if(!req.session.user)res.redirect('/');
	vcNews.findAllTags(function(vc){
		res.render('ad/addnews',{content:'""',tags:'""',allTags:vc.toString().split(','),navs:app.get('navTags')});
	});
});
app.get('/ad/addnews/:id',function(req,res){
	if(!req.session.user)res.redirect('/');
	vcNews.findbyId(req.params.id,function(docs){
		vcNews.findAllTags(function(vc){
			res.render('ad/addnews',{title:docs.title,content:'"'+escape(docs.content)+'"',author:docs.author,tags:'"'+docs.tags+'"',objId:docs._id.toString(),allTags:vc.toString().split(','),navs:app.get('navTags')});
		});
	});
});
app.put('/ad/addnews',function(req,res){
	if(!req.session.user)res.redirect('/');
	vcNews.create(req,function(id){
		res.json({ret:id});
	});	
});
app.post('/ad/addnews',function(req,res){
	if(!req.session.user)res.redirect('/');
	vcNews.update(req,function(i){
		res.json({ret:i});
	});
});
app.delete('/ad/list',function(req,res){
	if(!req.session.user)res.redirect('/');
	console.log('delete : '+req.body.id);
	vcNews.removebyId(req.body.id,function(i){
		res.json({ret:i});
	});
});
app.get('/ad/profile',function(req,res){
	if(!req.session.user)res.redirect('/');
	vcCommon.findbyName('profile',function(docs){
		res.render('ad/addCommon',{name:'profile',title:docs.title,content:'"'+escape(docs.content)+'"',objId:docs._id.toString(),navs:app.get('navTags')});
	});	
});
app.post('/ad/profile',function(req,res){
	if(!req.session.user)res.redirect('/');
	vcCommon.update(req,function(i){
		res.json({ret:i});
	});
});
app.get('/ad/contact',function(req,res){
	if(!req.session.user)res.redirect('/');
	var name='contact';
	vcCommon.findbyName(name,function(docs){
		res.render('ad/addCommon',{name:name,title:docs.title,content:'"'+escape(docs.content)+'"',objId:docs._id.toString(),navs:app.get('navTags')});
	});	
});
app.post('/ad/contact',function(req,res){
	if(!req.session.user)res.redirect('/');
	vcCommon.update(req,function(i){
		res.json({ret:i});
	});
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
