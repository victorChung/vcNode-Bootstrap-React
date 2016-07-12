var vcCommon=require('../controllers/vcCommon');


module.exports.profile=function(req,res){
	vcCommon.findbyName('profile',function(docs){
		res.render('common',{title:docs.title,content:docs.content,navs:global.navTags});
	});
};

module.exports.contact=function(req,res){
	vcCommon.findbyName('contact',function(docs){
		res.render('common',{title:docs.title,content:docs.content,navs:global.navTags});
	});
};


module.exports.adProfile=function(req,res){
	vcCommon.findbyName('profile',function(docs){
		res.render('ad/addCommon',{name:'profile',title:docs.title,content:'"'+escape(docs.content)+'"',objId:docs._id.toString(),navs:global.navTags});
	});	
};


module.exports.adPostProfile=function(req,res){
	vcCommon.update(req,function(i){
		res.json({ret:i});
	});
};


module.exports.adContact=function(req,res){
	var name='contact';
	vcCommon.findbyName(name,function(docs){
		res.render('ad/addCommon',{name:name,title:docs.title,content:'"'+escape(docs.content)+'"',objId:docs._id.toString(),navs:global.navTags});
	});	
};


module.exports.adPostContact=function(req,res){
	vcCommon.update(req,function(i){
		res.json({ret:i});
	});
};
