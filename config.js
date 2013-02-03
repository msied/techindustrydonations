module.exports = function(app, express){

	app.configure(function(){
		app.set('port', process.env.PORT_NODEJS || 80);
		app.set('views', __dirname + '/views');
		app.set('view engine', 'jade');
		app.use(express.bodyParser());
		app.use(express.cookieParser());
		app.use(express.session({
			secret: 'porkchopsandwiches'
		}));
		app.use(express.methodOverride());
		app.use(app.router);
		app.use(express.static(__dirname + '/public'));
		app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
	});

	app.configure('development', function(){
		app.use(express.errorHandler());
	});

}