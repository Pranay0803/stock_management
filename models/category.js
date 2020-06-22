var mongoose = require("mongoose");
var Dealer = require("./dealer");

var categorySchema = new mongoose.Schema({
    name: String
    
})

module.exports = mongoose.model("Category", categorySchema)