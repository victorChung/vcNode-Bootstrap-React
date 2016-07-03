var mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/news');

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

vcNews=mongoose.model('vcNews',vcNewsSchema);
