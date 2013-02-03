module.exports = function(mongoose, Schema){
	var donationSchema = new Schema({
		year : Number,
		state : String,
		amount : Number
	})

	var Donation = exports.Donation = mongoose.model('Donation', donationSchema)
}