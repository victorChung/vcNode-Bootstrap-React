//var mongoose=require('mongoose').connect('mongodb://localhost/secondProj');
var mongoose=require('mongoose');
var options={
	db:{native_parser:true},
	server:{poolSize:5},
	socketOptions:{
		keepAlive:1
	},
	auto_reconnect:true
};
var conn=mongoose.createConnection('mongodb://localhost/secondProj',options);

var Schema=mongoose.Schema;
var vcNewsSchema=new Schema({
	title:String,
	content:String,
	createTime:Date,
	clks:Number,
	author:String,
	tags:Array,
	isDel:Boolean
},{strict:false});

var vcNewsModel=conn.model('vcnews',vcNewsSchema);
//var vcNewsEntity=new vcNewsModel();
//vcNewsEntity=require('../models/news')();
//vcNewsEntity.title='what a trick!'+new Date().getUTCMilliseconds();
//vcNewsEntity.author='victor.Chung';
//module.exports.xxx=vcNewsEntity;
var save=function(){
	console.log('save');
	var vcNewsEntity=new vcNewsModel();
	vcNewsEntity=require('../models/news')();
	vcNewsEntity.save(function(err){
		if(err){
			console.log('save failed');
		}
		console.log('success to save');
	});
};
var create=function(res){
	var vcNewsEntity=new vcNewsModel();
	vcNewsModel.create(require('../models/news')(),function(err,vcNewsEntity){
		if(err){
			console.log(err);
		}
		findAll(res);
	});
};
var findAll=function(res){
	//console.log('conn : '+JSON.stringify(conn));
vcNewsModel.find({},function(err,docs){
	console.log('docs : '+docs);
	//conn.close();
	res.render('list',{title:'list',items:docs});	
	});

};

module.exports.create=create;
module.exports.findAll=findAll;
module.exports.save=save;
