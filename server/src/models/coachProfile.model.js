const mongoose = require('mongoose');

const coachProfileSchema = new mongoose.Schema({
    coach_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: {
        type: String,
    },
    experience_years: {
        type: Number,
        min: 0,
        max: 100
    },
    rating_avg: {
        type: Number,
        min: 0,
        max: 5
    },
    toal_sessions: {
        type: Number,
        min: 0
    },
    bio: {
        type: String,
        maxlength: 500
    }
}, { timestamps: true });

const CoachProfile = mongoose.model('CoachProfile', coachProfileSchema);
module.exports = CoachProfile;