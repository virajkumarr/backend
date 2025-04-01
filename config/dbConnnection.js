const mongoose = require("mongoose");

function DbConnection() {
    mongoose.connect("mongodb://127.0.0.1:27017/incomtexs", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));
}

module.exports = DbConnection;
