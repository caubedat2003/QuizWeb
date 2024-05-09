const router = require('express').Router();
const User = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddlewares = require('../middlewares/authMiddlewares');

//user registration
router.post('/register', async (req, res) => {
    try {
        //check if user already exists
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(200).send({
                message: 'User already exists',
                success: false
            });
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        //create new user
        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            message: 'User registered successfully',
            success: true
        });
    }
    catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});

//user login
router.post('/login', async (req, res) => {
    try {
        //check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({
                message: 'User does not exist',
                success: false
            });
        }

        //check password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(200).send({
                message: 'Invalid email or password',
                success: false
            });
        }
        //create and assign token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.send({
            message: 'Login successful',
            data: token,
            success: true
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});

//get user info
router.post('/get-user-info', authMiddlewares, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        res.send({
            message: 'User info retrieved successfully',
            data: user,
            success: true
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});

module.exports = router;