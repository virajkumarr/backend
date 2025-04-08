const mongoose = require('mongoose');

const faqQuestionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
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
        enum: ['pending', 'replied', 'archived'],
        default: 'pending'
    },
    reply: {
        type: String
    },
    repliedAt: {
        type: Date
    }
});

module.exports = mongoose.model('FAQQuestion', faqQuestionSchema); 