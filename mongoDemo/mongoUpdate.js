var mongoClient = require('mongodb').MongoClient;
var DB_CONN_STR='mongodb://localhost:27017/secondProj';
var updateData = function(db, callback) {  
	//连接到表  
	var collection = db.collection('vcNews');
	//更新数据
	var whereStr ={"title":'this for test1'}; 
	var updateStr = {$set: { "createTime" : new Date()}};
	collection.update(whereStr,updateStr, function(err, result) {
		if(err){
			console.log('Error:'+ err);
			return;
		}	 
		callback(result);
	 });
}

mongoClient.connect(DB_CONN_STR, function(err, db) {
	console.log("连接成功！");
	updateData(db, function(result) {
		console.log(result.result);
		db.close();
	});
});
