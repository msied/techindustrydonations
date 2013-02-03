module.exports = function(app){

	var bcrypt = require("bcrypt");

	app.get('/login', function(req,res){
		res.write("LOGIN")
		res.end();
	})

}