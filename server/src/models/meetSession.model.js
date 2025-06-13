const mongoose = require('mongoose');

const meetSessionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    coach_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    purpose: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    schedule_at: {
        type: Date,
        required: true,
    },
    meet_link: {
        type: String,
    }
}, { timestamps: true });

const MeetSession = mongoose.model('MeetSession', meetSessionSchema);

module.exports = MeetSession;