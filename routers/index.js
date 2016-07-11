exports.index=function(req,res){
	console.log('router get / ');
	console.log('index.js : '+req.url);
	console.log('navs : '+global.navTags);
	res.render('index',{title:'index',navs:global.navTags});
};
