const CoachProfile = require('../models/coachProfile.model');
const User = require('../models/user.model');

//Create a new coach profile
module.exports.createCoachProfile = async (req, res) => {
    try {
        const coachiId = req.user.id;
        const { specialization, experience_years, bio } = req.body;

        const user = await User.findById(coachiId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'coach') {
            return res.status(403).json({ message: 'User is not a coach' });
        }

        const existingProfile = await CoachProfile.findOne({ coach_id: coachiId });
        if (existingProfile) {
            return res.status(400).json({ message: 'Coach profile already exists' });
        }

        const newProfile = new CoachProfile({
            coach_id: coachiId,
            specialization,
            experience_years,
            bio
        });

        await newProfile.save();
        res.status(201).json({ message: 'Coach profile created successfully', newProfile });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Get all coach profiles
module.exports.getAllCoachProfiles = async (req, res) => {
    try {
        const profiles = await CoachProfile.find().populate('coach_id', 'name email role');
        if (profiles.length === 0) {
            return res.status(404).json({ message: 'No coach profiles found' });
        }
        res.status(200).json(profiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Get a coach profile by ID
module.exports.getCoachProfileById = async (req, res) => {
    try {
        const coachId = req.params.id;
        const profile = await CoachProfile.findOne({ coach_id: coachId }).populate('coach_id', 'name email avatar_url');
        if (!profile) {
            return res.status(404).json({ message: 'Coach profile not found' });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Update a coach profile
module.exports.updateCoachProfile = async (req, res) => {
    try {
        const coachId = req.params.id;
        const profile = await CoachProfile.findOne({ coach_id: coachId });
        if (!profile) {
            return res.status(404).json({ message: 'Coach profile not found' });
        }
        const { specialization, experience_years, bio } = req.body;

        profile.specialization = specialization;
        profile.experience_years = experience_years;
        profile.bio = bio;

        await profile.save();
        res.status(200).json({ message: 'Coach profile updated successfully', profile });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Delete a coach profile
module.exports.deleteCoachProfile = async (req, res) => {
    try {
        const coachId = req.params.id;
        const profile = await CoachProfile.findOneAndDelete({ coach_id: coachId });
        if (!profile) {
            return res.status(404).json({ message: 'Coach profile not found' });
        }
        res.status(200).json({ message: 'Coach profile deleted successfully', profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};