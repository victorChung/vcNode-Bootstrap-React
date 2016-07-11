var mongoose=require('mongoose');
var options={
	db:{native_parser:true},
	server:{poolSize:5},
	socketOptions:{
		keepAlive:1
	},
	auto_reconnect:true
};
//var conn=mongoose.createConnection('mongodb://localhost/secondProj',options);
var conn=mongoose.createConnection('mongodb://85c182c3-f951-490c-a91a-6e3d79e5ebe7:33b35120-4da9@192.168.1.19/85c182c3-f951-490c-a91a-6e3d79e5ebe7');

module.exports.mongoose=mongoose;
module.exports.conn=conn;
