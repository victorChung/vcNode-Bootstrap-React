var os = require('os');
module.exports= function() {
	var network = os.networkInterfaces();
	for(var i = 0; i < network.en1.length; i++) {
		var json = network.en1[i];
		if(json.family == 'IPv4') {
			//console.log('ip.js ip : '+json.address);
			return (json.address);
		}
	}
}


