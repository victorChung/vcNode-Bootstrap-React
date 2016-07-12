var vcNews=require('../controllers/vcNews');


module.exports.news=function(req,res){
	vcNews.findbyId(req.params.id,function(docs){
		vcNews.findbyTags(docs.tags,function(vc){
			var editTime=docs.editTime.toLocaleString();
			res.render('news',{title:docs.title,content:docs.content,author:docs.author,tags:docs.tags,editTime:editTime,items:vc,navs:global.navTags});
		});
	});	
};


module.exports.adNews=function(req,res){
	vcNews.findAllTags(function(vc){
		res.render('ad/addnews',{content:'""',tags:'""',allTags:vc.toString().split(','),navs:global.navTags});
	});
};


module.exports.adGetNews=function(req,res){
	vcNews.findbyId(req.params.id,function(docs){
		vcNews.findAllTags(function(vc){
			res.render('ad/addnews',{title:docs.title,content:'"'+escape(docs.content)+'"',author:docs.author,tags:'"'+docs.tags+'"',objId:docs._id.toString(),allTags:vc.toString().split(','),navs:global.navTags});
		});
	});
};


module.exports.adPutNews=function(req,res){
	vcNews.create(req,function(id){
		res.json({ret:id});
	});	
};


module.exports.adPostNews=function(req,res){
	vcNews.update(req,function(i){
		res.json({ret:i});
	});
};


module.exports.adDeleteNews=function(req,res){
	vcNews.removebyId(req.body.id,function(i){
		res.json({ret:i});
	});
};



