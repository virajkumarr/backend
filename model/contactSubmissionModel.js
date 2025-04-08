const mongoose = require('mongoose');

const contactSubmissionSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    subject: {
        type: String
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'replied', 'converted'],
        default: 'pending'
    },
    reply: {
        type: String
    },
    repliedAt: {
        type: Date
    }
});

module.exports = mongoose.model('ContactSubmission', contactSubmissionSchema); 