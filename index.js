const express = require("express");
const mongoose = require("mongoose");
const DbConnection = require("./config/dbConnnection");
const app = express();
const port = 3000;
const cors = require("cors");
const User = require("./model/userModel")
const paymentModel = require("./model/paymentModel")

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173', // Your React app's URL
    credentials: true
}));

// Database Connection
DbConnection();

// Routes
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/user/create", async function(req, res) {
    try {
        const { fullname, email, password, mobile } = req.body;
        
        // Validation
        if (!fullname || !email || !password || !mobile) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }

        // Check if user exists
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ 
                success: false,
                message: "User already exists" 
            });
        }

        // Create new user
        const user = await User.create({ 
            fullname, 
            email, 
            password, 
            mobile 
        });

        res.status(201).json({ 
            success: true,
            message: "User created successfully", 
            user: {
                fullname: user.fullname,
                email: user.email,
                mobile: user.mobile
            }
        });
    } catch (err) {
        console.error('User creation error:', err);
        res.status(500).json({ 
            success: false,
            message: "Server error occurred",
            error: err.message 
        });
    }
});

app.get("/getalluser", async function(req, res) {
    try {
        const users = await User.find().select('-password');
        res.json({
            success: true,
            users
        });
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch users",
            error: err.message 
        });
    }
});

// Payment Logical part
app.post("/payment/create", async function(req, res) {
    try {
        const { username, email, taxfileid, amount, paymentdate } = req.body;
        if (!username || !email || !taxfileid || !amount || !paymentdate) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }

        const payment = await paymentModel.create({ 
            username, 
            email, 
            taxfileid, 
            amount, 
            paymentdate 
        });

        res.status(201).json({ 
            success: true,
            message: "Payment successful", 
            payment 
        });
    } catch (err) {
        console.error('Payment creation error:', err);
        res.status(500).json({ 
            success: false,
            message: "Payment failed",
            error: err.message 
        });
    }
});

app.get("/getfetch/payment", async function(req, res) {
    try {
        const payments = await paymentModel.find();
        res.json({
            success: true,
            payments
        });
    } catch (err) {
        console.error('Get payments error:', err);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch payments",
            error: err.message 
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

