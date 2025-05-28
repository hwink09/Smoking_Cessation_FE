const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

//Create token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            avatar_url: user.avatar_url
        },
        process.env.JWT_SECRET,
        {
            expiresIn: maxAge
        }
    );
}
//Register
module.exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists!' });
        }
        const newUser = new User({
            name,
            email,
            password,
        })
        await newUser.save();

        return res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
//Login
module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email not exist!' })
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = createToken(user);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
                avatar_url: user.avatar_url,
                token: token
            },

        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}