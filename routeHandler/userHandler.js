const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require('../schema/userSchema');
const router = express.Router();

const User = new mongoose.model('User', userSchema);


router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.json({ message: "User created successfully" });

    } catch (err) {
        res.status(500).json({
            error: "Failed to create user"
        });
    }
});
//LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

        res.json({ "access_token": token, "message": "User logged in successfully" });

    } catch (err) {
        res.status(500).json({
            error: "Failed to login"
        });
    }
});
// GET ALL USERS
router.get('/all', async (req, res) => {
    try {
        const users = await User.find()
            .populate('todos', 'title description status date')
            .select('name email status todos');
        res.json(users);
    }
    catch (err) {
        res.status(500).json({
            error: "Failed to fetch users"
        });
    }
});

// Update a user
router.put('/:id', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const updateData = { name, email };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

        res.json(updatedUser);

    }
    catch (err) {
        res.status(500).json({
            error: "Failed to update user"
        });
    }

});

// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    }
    catch (err) {
        res.status(500).json({
            error: "Failed to delete user"
        });
    }
});

module.exports = router;