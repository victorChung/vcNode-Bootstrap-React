var mongoClient=require('mongodb').MongoClient;
var DB_CONN_STR='mongodb://localhost:27017/secondProj';

var selectData=function(db,callback){
	var collection=db.collection('vcNews');

	var whereStr={};

	collection.find(whereStr).toArray(function(err,result){
		if(err){
			console.log('Error:'+err);
			return;
		}
		callback(result);
	});
}

mongoClient.connect(DB_CONN_STR,function(err,db){
	console.log('success to connect');
	selectData(db,function(result){
		console.log(result);
		db.close();
	});
});
