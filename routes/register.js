module.exports = function(app, Firebase){

	var bcrypt = require("bcrypt");

	app.get('/register', function(req,res){
		res.write("REGISTER")
		res.end();
	})

}