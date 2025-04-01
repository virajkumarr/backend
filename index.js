const express = require("express");
const mongoose = require("mongoose");
const DbConnection = require("./config/dbConnnection");
const app = express();
const port = 3000;
const cors = require("cors");
const User = require("./model/userModel")
const paymentModel = require("./model/paymentModel")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
cors()
DbConnection()
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.post("/user/create", async function(req, res) {
    try {
        const { fullname, email, password, mobile } = req.body;
        if (!fullname || !email || !password || !mobile) {
            return res.status(400).json({ message: "All fields are required" });
        }

      const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = await User.create({ fullname, email, password, mobile });

        res.status(201).json({ message: "User created successfully", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/getalluser", function(req, res){
    User.find().then(function(users){
        res.json(users);
        }).catch(function(err){
            res.status(500).json({error: err.message});
            });
        
})


// Payment Logical part

app.post("/payment/create", async function(req, res) {
    try {
        const { username,email,taxfileid,amount, paymentdate } = req.body;
        if (!username || !email || !taxfileid || !amount ||!paymentdate) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const payment = await paymentModel.create({  username,email,taxfileid,amount, paymentdate });

        res.status(201).json({ message: "your payment done", payment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.get("/getfetch/payment", function(req, res){
    paymentModel.find().then(function(payment){
        res.json(payment);
        }).catch(function(err){
            res.status(500).json({error: err.message});
            });
        
})

