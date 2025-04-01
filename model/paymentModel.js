const mongoose = require("mongoose");
const paymentSchema = mongoose.Schema({
    username: String,
    email: String,
    taxfileid: String,
    amount: String,
    paymentdate:Date
    
})
const paymentModel = mongoose.model("payment", paymentSchema);
module.exports = paymentModel;
//username,email,taxfileid,amount, paymentdate