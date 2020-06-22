var mongoose = require("mongoose");
    
var recordSchema = new mongoose.Schema({
    dealer: String,
    category: String,
    quantity: Number,
    amount: Number,
    TransactionDate: { type: Date, default: Date.now }
})


module.exports = mongoose.model("Record", recordSchema)