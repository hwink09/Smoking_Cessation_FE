const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'coach'],
        default: 'user',
    },
    avatar_url: {
        type: String,
        default: 'https://example.com/default-avatar.png',
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    vertificationToken: {
        type: String,
        default: null,
    },
    ressetPasswordToken: {
        type: String,
        default: undefined,
    },
    ressetPasswordExpires: {
        type: Date,
        default: undefined,
    }

}, { timestamps: true });
// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
// Compare the password with the hashed password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;