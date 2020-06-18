var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
    
var dealerSchema = new mongoose.Schema({
    companyname: String,
    fname: String,
    lname: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    email: String,
    contact: String,
    website: String
})

dealerSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Dealer", dealerSchema)