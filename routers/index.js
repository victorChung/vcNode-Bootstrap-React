exports.index=function(req,res){
	console.log('router get / ');
	console.log('index.js : '+req.url);
	res.render('index',{title:'index'});
};
