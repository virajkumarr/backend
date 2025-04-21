const express = require("express");
const mongoose = require("mongoose");
const DbConnection = require("./config/dbConnnection");
const app = express();
const port = 3000;
const cors = require("cors");
const User = require("./model/userModel")
const paymentModel = require("./model/paymentModel")
const AdminCredential = require("./model/adminCredentialModel")
const ContactSubmission = require("./model/contactSubmissionModel")
const FAQQuestion = require("./model/faqQuestionModel")
const userRoutes = require("./routes/userRoutes")

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173', // Your React app's URL
    credentials: true
}));

// Database Connection
DbConnection();

// User routes
app.use('/user', userRoutes);

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

// User Login route
app.post("/user/login", async function(req, res) {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "Email and password are required" 
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        // Verify password (in a real app, you should use bcrypt or similar)
        if (user.password !== password) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        // Return success with user data (excluding password)
        res.status(200).json({ 
            success: true,
            message: "Login successful",
            user: {
                fullname: user.fullname,
                email: user.email,
                mobile: user.mobile
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            success: false,
            message: "Server error occurred",
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

// Contact form submission
app.post("/contact/submit", async function(req, res) {
    try {
        const { firstName, lastName, email, phone, subject, message, date } = req.body;
        
        // Validation
        if (!email || !message) {
            return res.status(400).json({ 
                success: false,
                message: "Email and message are required" 
            });
        }

        // Create new contact submission
        const contact = await ContactSubmission.create({
            firstName,
            lastName,
            email,
            phone,
            subject,
            message,
            date: date || new Date(),
            status: 'pending'
        });

        res.status(201).json({ 
            success: true,
            message: "Message sent successfully",
            contact
        });
    } catch (err) {
        console.error('Contact submission error:', err);
        res.status(500).json({ 
            success: false,
            message: "Failed to send message",
            error: err.message 
        });
    }
});

// Get contact form submissions
app.get("/contact/submissions", async function(req, res) {
    try {
        const submissions = await ContactSubmission.find().sort({ date: -1 });
        res.json({
            success: true,
            submissions
        });
    } catch (err) {
        console.error('Get contact submissions error:', err);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch submissions",
            error: err.message 
        });
    }
});

// FAQ routes
app.get("/faq/questions", async function(req, res) {
    try {
        const questions = await FAQQuestion.find().sort({ date: -1 });
        res.json({
            success: true,
            questions
        });
    } catch (err) {
        console.error('Get FAQ questions error:', err);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch questions",
            error: err.message 
        });
    }
});

app.post("/faq/reply/:id", async function(req, res) {
    try {
        const { id } = req.params;
        const { reply } = req.body;
        
        if (!reply) {
            return res.status(400).json({ 
                success: false,
                message: "Reply is required" 
            });
        }

        const question = await FAQQuestion.findByIdAndUpdate(
            id,
            { 
                reply,
                repliedAt: new Date(),
                status: 'replied'
            },
            { new: true }
        );

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        res.json({
            success: true,
            message: "Reply sent successfully",
            question
        });
    } catch (err) {
        console.error('Reply to FAQ error:', err);
        res.status(500).json({ 
            success: false,
            message: "Failed to send reply",
            error: err.message 
        });
    }
});

app.delete("/faq/delete/:id", async function(req, res) {
    try {
        const { id } = req.params;
        
        const question = await FAQQuestion.findByIdAndDelete(id);
        
        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        res.json({
            success: true,
            message: "Question deleted successfully"
        });
    } catch (err) {
        console.error('Delete FAQ question error:', err);
        res.status(500).json({ 
            success: false,
            message: "Failed to delete question",
            error: err.message 
        });
    }
});

// Convert contact submission to FAQ question
app.post("/faq/convert/:contactId", async function(req, res) {
    try {
        const { contactId } = req.params;
        
        // Find the contact submission
        const contact = await ContactSubmission.findById(contactId);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact submission not found"
            });
        }

        // Create new FAQ question from contact
        const question = await FAQQuestion.create({
            email: contact.email,
            subject: contact.subject,
            message: contact.message,
            date: contact.date,
            status: 'pending'
        });

        // Update contact status
        contact.status = 'converted';
        await contact.save();

        res.json({
            success: true,
            message: "Contact converted to FAQ question successfully",
            question
        });
    } catch (err) {
        console.error('Convert contact to FAQ error:', err);
        res.status(500).json({ 
            success: false,
            message: "Failed to convert contact to FAQ",
            error: err.message 
        });
    }
});

// Admin Credentials routes
app.post("/admin/credentials/create", async function(req, res) {
    try {
        const { username, password, email, role } = req.body;
        
        // Validation
        if (!username || !password || !email) {
            return res.status(400).json({ 
                success: false,
                message: "Username, password, and email are required" 
            });
        }

        // Check if admin already exists
        const existingAdmin = await AdminCredential.findOne({ 
            $or: [{ username }, { email }] 
        });
        
        if (existingAdmin) {
            return res.status(400).json({ 
                success: false,
                message: "Admin with this username or email already exists" 
            });
        }

        // Create new admin
        const admin = await AdminCredential.create({ 
            username, 
            password, 
            email, 
            role: role || "admin" 
        });

        res.status(201).json({ 
            success: true,
            message: "Admin credential created successfully",
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (err) {
        console.error('Admin credential creation error:', err);
        res.status(500).json({ 
            success: false,
            message: "Failed to create admin credential",
            error: err.message 
        });
    }
});

app.get("/admin/credentials", async function(req, res) {
    try {
        const admins = await AdminCredential.find().select('-password');
        res.json({
            success: true,
            admins
        });
    } catch (err) {
        console.error('Get admin credentials error:', err);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch admin credentials",
            error: err.message 
        });
    }
});

app.delete("/admin/credentials/:id", async function(req, res) {
    try {
        const { id } = req.params;
        
        const admin = await AdminCredential.findByIdAndDelete(id);
        
        if (!admin) {
            return res.status(404).json({ 
                success: false,
                message: "Admin credential not found" 
            });
        }
        
        res.json({
            success: true,
            message: "Admin credential deleted successfully"
        });
    } catch (err) {
        console.error('Delete admin credential error:', err);
        res.status(500).json({ 
            success: false,
            message: "Failed to delete admin credential",
            error: err.message 
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

