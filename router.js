var express=require('express');
var session=require('express-session');
//var cookieParser=require('cookie-parser');
var bodyParser=require('body-parser');
var formidable=require('formidable');
var fs=require('fs');
var path=require('path');
var router=express.Router();
var app=express();

var prog=0;
router.use(bodyParser.urlencoded({extended:false}));
//router.use(cookieParser);
router.use(session({
	resave:false,
	saveUninitialized:true,
	secret:'vc',
	uploadProgress:0,
	cookie:{maxAge:3600*24}
}));
router.get('/',function(req,res,next){
	console.log('router.js get / ');
	res.render('index',{title:'index'});
});

router.get('/start',function(req,res,next){
	console.log('router.js get /start ');
	res.render('start',{title:'start'});
});

router.post('/showPost',function(req,res,next){
	console.log('router.js get /showPost ');
	res.render('showPost',{title:'showPost',postData:req.body.text});
});

router.post('/upload',function(req,res){
	prog=0;
	var form=new formidable.IncomingForm();
	form.uploadDir='upload';
	form.keepExtensions=true;
	form.multiples=true;
	form.maxFieldsSize=1024*1024;
	//console.log(form);
	var filePath=path.join(__dirname,form.uploadDir);
	console.log('filePath : '+filePath);
	if(!fs.existsSync(filePath)){
		fs.mkdirSync(filePath,function(){
			if(err){
				return console.error(err);
			}
			console.log('success to mkdir');
		});
	}
	form.parse(req,function(err,fields,files){
		console.log('parsing done');

		  Object.keys(fields).forEach(function(name) {
			      console.log('got field named ' + name);
				    });
		   
		    Object.keys(files).forEach(function(name) {
				    console.log('got file named ' + name);
					  });
//		res.end('\nupload completed');
	});
	form.on('progress', function(bytesReceived, bytesExpected) {
		var percent=Math.floor(bytesReceived/bytesExpected*100);
		// 存入 
	//	req.session.uploadProgress=percent;
		prog=percent;
		//console.log('percent : '+ percent);
	});
	form.on('end',function(){
		//res.render('showPic',{postData:''});
		req.abort();
		
		console.log('end');
		//res.end();
		console.log('destroyed');
	});
});

router.post('/uploadProgress',function(req,res){
	res.send({'progress':prog});
});

router.get('/showUpload',function(req,res){
	
});

module.exports=router;
