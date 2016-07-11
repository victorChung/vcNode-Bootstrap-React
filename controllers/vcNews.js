/*
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
*/
var mongoose=global.mongoose;
var conn=global.conn;

var Schema=mongoose.Schema;
var vcNewsSchema=new Schema({
	title:String,
	content:String,
	createTime:Date,
	editTime:Date,
	clks:Number,
	author:String,
	tags:Array,
	isDel:Boolean
},{strict:false});

var vcNewsModel=conn.model('vcnews',vcNewsSchema);
//var vcNewsEntity=new vcNewsModel();
//vcNewsEntity=require('../models/news')();
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
var update=function(req,cb){
	var title=unescape(req.body.title);
	var content=unescape(req.body.content);
	var tags=unescape(req.body.tags).split(' ');
	var author=unescape(req.body.author);
	var objId=req.body.objId;

	var conditions={_id:objId};
	var update={$set:{title:title,content:content,tags:tags,author:author,editTime:new Date()}};
	var options={};
	vcNewsModel.update(conditions,update,options,function(err,docs){
		if(err){
			console.log(docs+','+err);	
			cb(0);
		}
		else{
			cb(1);
		}

	});
};
var create=function(req,cb){
	var vcNewsEntity=new vcNewsModel();
	vcNewsEntity=require('../models/news')();
	vcNewsEntity.title=unescape(req.body.title);
	vcNewsEntity.content=unescape(req.body.content);
	vcNewsEntity.tags=unescape(req.body.tags).split(' ');
	vcNewsEntity.author=unescape(req.body.author);
	vcNewsModel.create(vcNewsEntity,function(err,vcNewsEntity){
		if(err){
			console.log(err);
			cb(0);
		}
		findLts(function(id){
			cb(id);
		});
	});
};
var findLts=function(cb){
	vcNewsModel
	.find({})
	.limit(1)
	.sort('-editTime')
	.select('_id')
	.exec(function(err,vc){
		if(err)console.log(err);
		cb(vc[0]._id);
	});
	
};
var findbyId=function(id,cb){
	vcNewsModel
	.find({_id:id})
	.select('_id title content clks author tags createTime editTime')
	.exec(function(err,vc){
		if(err)console.log(err);
		cb(vc[0]);
	});
};
var findAllTags=function(cb){
	vcNewsModel.distinct('tags',{isDel:false},function(err,docs){
		if(err)console.log(err);
		//console.log('allTags : '+docs);
		cb(docs);
	});
};
var findbyTags=function(tags,cb){
	console.log('byTags : '+tags);
	vcNewsModel
		.find({'tags':{$in:tags}})
		.limit(10)
		.sort('-editTime')
		.select('_id title editTime')
		.exec(function(err,vc){
			if(err)console.log(err);
			cb(vc);
		});
};
var findAll=function(cb){
	vcNewsModel
		.find({isDel:false})
		.sort('-editTime')
		.exec(function(err,docs){
			cb(docs);
		});
};
var removebyId=function(id,cb){
	var conditions={_id:id};
	var update={$set:{isDel:true,editTime:new Date()}};
	var options={};
	vcNewsModel.update(conditions,update,options,function(err,docs){
		if(err){
			console.log(docs+','+err);	
			cb(0);
		}
		else{
			cb(1);
		}
	});

};


module.exports.create=create;
module.exports.findAll=findAll;
module.exports.update=update;
module.exports.save=save;
module.exports.findbyId=findbyId;
module.exports.findbyTags=findbyTags;
module.exports.findAllTags=findAllTags;
module.exports.removebyId=removebyId;
