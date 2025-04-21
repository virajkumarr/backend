const express = require('express');
const router = express.Router();
const User = require('../model/userModel');

// Delete user by email
router.delete('/delete/:email', async (req, res) => {
    try {
        const { email } = req.params;
        
        const user = await User.findOneAndDelete({ email });
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }
        
        res.json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ 
            success: false,
            message: "Failed to delete user",
            error: err.message 
        });
    }
});

module.exports = router; 