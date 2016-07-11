module.exports=function(){
	var dt=new Date();
	return {
	'title':"ttitle"+dt.getTime(),
	'content':"cccontent"+dt.getTime(),
	'createTime':dt,
	'editTime':dt,
	'clks':0,
	'author':'victor.Chung',
	'tags':[],
	'isDel':false
	};
}
