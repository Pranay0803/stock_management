var mongoose = require("mongoose");
    
var dealerSchema = new mongoose.Schema({
    companyname: String,
    fname: String,
    lname: String,
    category: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    email: String,
    contact: String,
    website: String
})


module.exports = mongoose.model("Dealer", dealerSchema)