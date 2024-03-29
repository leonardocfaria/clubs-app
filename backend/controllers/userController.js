const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

//@desc     Register user
//@route    POST /api/users
//@access   Public 
const registerUser = asyncHandler( async(req,res) => {
    const {name, email, password} = req.body

    if( !name || !email || !password) {
        res.status(400)
        throw new Error('Please complete all fields')
    }

    //Check if user exists
    const userExist = await User.findOne({email})
    if(userExist) {
        res.status(400)
        throw new Error('User already exists')
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
   

    //Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        isAdmin: false
    })
    
    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),

        })
    } else {
        res.status(400)
        throw new Error('Invalid user')
    }
})

//@desc     Log-in user
//@route    POST /api/users/login
//@access   Public 
const loginUser = asyncHandler( async(req,res) => {
    const {email, password} = req.body

    //Check for email
    const user = await User.findOne({email})
    
   
    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            isAdmin: user.isAdmin,
        })
    } else{
        res.status(400)
        throw new Error('Invalid credentials' )

    }
    

    res.json({ message: 'Login user' })
})

//@desc     Get user data
//@route    GET /api/users/me
//@access   Private 
const getMe = asyncHandler( async(req,res) => {
    res.status(200).json(req.user)
})

//Generate JWT token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}




module.exports = {
    registerUser,
    loginUser,
    getMe,
}