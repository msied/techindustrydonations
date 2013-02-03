module.exports = function(mongoose){

	var Schema = mongoose.Schema;
	
	require('./state')(mongoose, Schema)
	require('./Donation')(mongoose, Schema)
}