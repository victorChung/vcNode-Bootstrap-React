'use strict';

module.exports=function(server){

	console.log('module vcSocket.js');
var ip=require('../util/ip');

var io=require('socket.io').listen(server);
var nicknames=[];
io.on('connection',function(socket){
	//socket.id
	//console.log(io.sockets.sockets);
	var skPeername=socket.request.client._peername;
	console.log('client connection from : '+skPeername.address+':'+skPeername.port);
	//console.log(socket.request.client._peername);
	socket.emit('news',{msg:'hello client'});
	//console.log(socket.handshake);
	var client={
		socket:socket,
		name:false
	};
	nicknames.push(client);
	console.log('default nicknames.length : '+nicknames.length);

	socket.on('sendMyData',function(data){
		console.log('from client : '+data.msg);
	});
	socket.on('disconnect',function(){
		io.emit('user disconnected');
	});


	socket.on('message',function(data,callback){
		var obj={time:new Date()};
		if(!client.name){
			client.name=data;
			obj.text=data;
			obj.author='system';
			obj.type='welcome';
			console.log(client.name+' login');
			
			for(var i in nicknames){
				//console.log('i '+nicknames.socket.id);
				if(nicknames[i].socket===socket){
					nicknames[i].name=data;
					console.log('setname i.name : '+nicknames[i].name);
				}
			}

			socket.emit('system',obj);
			socket.broadcast.emit('system',obj);
		}
		else{
			obj.text=data;
			obj.author=client.name;
			obj.type='message';

			console.log(client.name+' say: '+data);

			socket.emit('message',obj);
			socket.broadcast.emit('message',obj);
		}
//		console.log('message : '+data);
	});

	socket.on('private message',function(to,msg){
		var obj={time:new Date()};
		obj.text=msg;
		obj.author=client.name;
		obj.type="private message";
		obj.to=to;
		for(var i in nicknames){
			console.log('to : '+to+' ,i.name:'+nicknames[i].name);
			if(nicknames[i].name===to){
				console.log('pm emit...');
				nicknames[i].socket.emit('private message',obj);
				socket.emit('private message',obj);
				console.log(obj.author+'->'+to+' : '+obj.text);
				break;
			}
		}
	});

	
	socket.on('disconnect',function(){
		console.log(client.name +' disconnect');
		var obj={
			time:new Date(),
			autor:'system',
			text:client.name,
			type:'disconnect'
		};

		socket.broadcast.emit('system',obj);
		for(var i in nicknames){
			if(nicknames[i].name===client.name){
				nicknames.splice(i,1);
			}
		}
	});
});

};
