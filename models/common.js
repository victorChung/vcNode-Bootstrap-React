module.exports=function(){
	var dt=new Date();
	return {
	'cid':0,
	'name':'default name',
	'title':"ttitle"+dt.getTime(),
	'content':"cccontent"+dt.getTime(),
	'createTime':dt,
	'editTime':dt,
	'clks':0,
	'isDel':false
	};
}
