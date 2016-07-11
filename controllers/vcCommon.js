var mongoose=global.mongoose;
var conn=global.conn;

var Schema=mongoose.Schema;
var vcCommonSchema=new Schema({
	cid:Number,
	name:String,
	title:String,
	content:String,
	createTime:Date,
	editTime:Date,
	clks:Number,
	isDel:Boolean
},{strict:false});

var vcCommonModel=conn.model('vccommons',vcCommonSchema);

var create=function(cb){
	var vcCommonEntity=new vcCommonModel();
	vcCommonEntity=require('../models/common')();
	vcCommonModel.create(vcCommonEntity,function(err,docs){
		if(err){
			console.log(err);
			cb(0);
		}
		console.log('docs : '+docs);
		findLts(function(id){
			cb(id);
		});
	});
};

var findbyName=function(name,cb){
	vcCommonModel
	.find({name:name})
	.limit(1)
	.select('_id cid name title content createTime editTime clks isDel')
	.exec(function(err,vc){
		if(err)console.log(err);
		cb(vc[0]);
	});
};

var findLts=function(cb){
	vcCommonModel
	.find({})
	.limit(1)
	.sort('-editTime')
	.select('_id')
	.exec(function(err,vc){
		if(err)console.log(err);
		cb(vc[0]._id);
	});
};


var update=function(req,cb){
	var title=unescape(req.body.title);
	var content=unescape(req.body.content);
	var objId=req.body.objId;

	var conditions={_id:objId};
	var update={$set:{title:title,content:content,editTime:new Date()}};
	var options={};
	vcCommonModel.update(conditions,update,options,function(err,docs){
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
module.exports.findLts=findLts;
module.exports.findbyName=findbyName;
module.exports.update=update;
