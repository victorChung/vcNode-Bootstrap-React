var mongoose=require('mongoose');
var options={
	db:{native_parser:true},
	server:{poolSize:5},
	socketOptions:{
		keepAlive:1
	},
	auto_reconnect:true
};
var conn=mongoose.createConnection((process.env.XCONN||'mongodb://localhost/secondProj'),options);

module.exports.mongoose=mongoose;
module.exports.conn=conn;
