const mongoose = require('mongoose');

const ChatSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    prompts: [{
        promptId: {
            type: String,
            required: true,
        },
        prompt: {
            type: String,
            required: true,
        },
        responses: [{
            type: String,
            required: true,
        }]
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
