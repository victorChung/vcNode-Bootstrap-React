var vcNews=require('../controllers/vcNews');

module.exports.list=function(req,res){
	vcNews.findAll(function(docs){
		res.render('list',{title:'list',items:docs,navs:global.navTags,tag:''});
	});
};

module.exports.listTag=function(req,res){
	var tag=req.params.tag;
	var breads=[
			{
				name:'Articles',
				url:'lsit'
			},
			{
				name:tag,
				url:req.url
			}
		];
	vcNews.findbyTags(new Array(tag),function(docs){
		res.render('list',{title:tag,items:docs,tag:tag,navs:global.navTags});
	});	
};


module.exports.adList=function(req,res){
	vcNews.findAll(function(docs){
		res.render('ad/list',{items:docs,navs:global.navTags});	
	});
};

