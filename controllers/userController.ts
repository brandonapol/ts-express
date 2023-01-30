import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel'

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) =>{
    const { name, email, password } = req.body 

    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please add all fields')
    }
    const userExists = await User.findOne({ email })

    if(userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Auth new user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) =>{
    const { email, password} = req.body 

    const user = await User.findOne({email})

    if(user && ( await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

// @desc    Get current logged in user
// @route   GET /api/users/me
// @access  Public
// TODO: Update
// const getMe = asyncHandler(async (req, res) =>{
//     //* we 'got' user.id from authMiddleware
//     const { _id, name, email } = await User.findById(req.user.id)

//     res.status(200).json({
//         id: _id,
//         name,
//         email
//     })
// })

// generate token
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || '';
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign({ id }, secret, { expiresIn: '30d' });
  };

module.exports = {
    registerUser,
    loginUser
    // getMe
}