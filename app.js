var express = require('express'),
	app = express();

//mongoose.connect('mongodb://localhost/datafest');

var goOn = function(){
	//require('./schemas')(mongoose);
	require('./config')(app, express);
	require('./globals')();

	require('./routes')(app);
	require('http').createServer(app).listen(app.get('port'), function(){
	  console.log("Express server listening on port " + app.get('port'));
	});
}

//mongoose.connection.on("open", goOn)
goOn();