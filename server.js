var express=require('express');
var ip=require('./util/ip');

var app=express();

app.set('ip',ip());
app.set('port',process.env.PORT||8888);


app.get('*',function(req,res){
	res.end('404');
});


var server=app.listen(app.get('port'),function(){
	console.log('server started on ip : '+app.get('ip')+':'+app.get('port'));
});
