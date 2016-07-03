module.exports=function(req,res){
	console.log('start.js : '+req.url);
	res.render('start',{title:'start'});
};
