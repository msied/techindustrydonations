module.exports = function(mongoose, Schema){
	var stateSchema = new Schema({
		year : Number,
		state : String,
		h1b : Number
	})

	var State = exports.State = mongoose.model('State', stateSchema)
}