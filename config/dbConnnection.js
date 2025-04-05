const mongoose = require("mongoose");

async function DbConnection() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/incomtexs", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            family: 4
        });
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        setTimeout(DbConnection, 5000);
    }
}

module.exports = DbConnection;
