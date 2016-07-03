module.exports.findAll=function(res){
//var mongoose=require('mongoose').connect('mongodb://localhost/secondProj');
var mongoose=require('mongoose');
var conn=mongoose.createConnection('mongodb://localhost/secondProj');

var Schema=mongoose.Schema;
var vcNewsSchema=new Schema({
	title:String,
	content:String,
	createTime:Date,
	clks:Number,
	author:String,
	tags:Array,
	isDel:Boolean
});

var vcNewsModel=conn.model('vcnews',vcNewsSchema);
var vcNewsEntity=new vcNewsModel();
vcNewsEntity.title='what a trick!'+new Date().getUTCMilliseconds();
vcNewsEntity.author='victor.Chung';
//module.exports.xxx=vcNewsEntity;
/*
vcNewsEntity.save(function(err){
		if(err){
			console.log('save failed');
		}
	console.log('success to save');
	});
*/	
vcNewsModel.find({},function(err,docs){
	console.log('docs : '+docs);
	//res.send(JSON.stringify(docs));
	conn.close();
	res.render('list',{title:'list',items:docs});	
	});

};
