var mongoClient = require('mongodb').MongoClient;
var DB_CONN_STR='mongodb://localhost:27017/secondProj';

var delData = function(db, callback) {  
	  //连接到表  
	var collection = db.collection('vcNews');
	  //删除数据
	var whereStr = {"title":'update this'};
	collection.remove(whereStr, function(err, result) {
		if(err)
		{
			console.log('Error:'+ err);
			return;
		}     
		callback(result);
	});
}

mongoClient.connect(DB_CONN_STR, function(err, db) {
	console.log("连接成功！");
	delData(db, function(result) {
		console.log(result.result);
		db.close();
	 });
 });
