module.exports=function(req,res){
	console.log('into showPost.js ');
	res.render('showPost',{title:'showPost',postData:req.body.text});
}
