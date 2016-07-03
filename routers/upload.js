var bodyParser=require('body-parser');
var formidable=require('formidable');
var path=require('path');
var fs=require('fs');

global.prog=0;

module.exports.upload=function(req,res){
	console.log('module  upload');	
	global.prog=0;
	var dir='upload';
	var filePath=path.join(__dirname,'..',dir);
	if(!fs.existsSync(filePath)){
		fs.mkdirSync(filePath,function(){
			if(err){
				return console.error(err);
			}
			console.log('success to mkdir');
		});
	}
	console.log('filePath : '+filePath);
	console.log('___prog : '+global.prog);
	var form=new formidable.IncomingForm();
	form.uploadDir='upload';
	form.keepExtensions=true;
	form.multiples=true;
	form.maxFieldsSize=1024*1024;
	//console.log(form);
	form.parse(req,function(err,fields,files){
		console.log('parsing done');
		  Object.keys(fields).forEach(function(name) {
			      console.log('got field named ' + name);
				    });
		   
		    Object.keys(files).forEach(function(name) {
				    console.log('got file named ' + name);
					  });
	});
	form.on('progress', function(bytesReceived, bytesExpected) {
	
			var percent=Math.floor(bytesReceived/bytesExpected*100);
			// 存入 
			global.prog=percent;
	});
	form.on('end',function(){
		console.log('end');
	});
};

module.exports.uploadProgress=function(req,res){
//	console.log('progress : '+global.prog);
	res.send({'progress':global.prog});
};

