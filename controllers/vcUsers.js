var mongoose=global.mongoose;
var conn=global.conn;

var Schema=mongoose.Schema;
var vcUsersSchema=new Schema({
	name:String,
	pwd:String,
	isDel:Boolean
},{strict:false});

var vcUsersModel=conn.model('vcusers',vcUsersSchema);

var findLts=function(cb){
	vcUsersModel
	.find({})
	.limit(1)
	.sort('-editTime')
	.select('_id')
	.exec(function(err,vc){
		if(err)console.log(err);
		cb(vc[0]._id);
	});
};

module.exports.findLts=findLts;
