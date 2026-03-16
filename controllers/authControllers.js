const jwt = require('jsonwebtoken')
import User from '../models/User'
const bcrypt = require('bcryptjs') 

export const signup = async (req,res) => { 
    const { email, password } = req.body

    const existingUser = await User.findOne({email})

    if (existingUser) {
        return res.status(404).json({
            message: 'User already exists'
        })
    } 
    
    const hashedPassword = await bcrypt.hash( password, 10 )

    const user = new User ({
        email,
        password : hashedPassword
    })

    await user.save()

    res.status(201).json({
        message: 'Your sign-up has been successful.'
    })

}

export const login = async (req,res) => { 
    const {email , password } = req.body

    const user = User.findOne({email})

    if (!user) {
        return res.status(40).json( {message: 'Invalid essentials, please try with correct credentials'} )
    }

    const isMatch = await bcrypt.compare( password, user.Password)

    if (!isMatch) {
        return res.status(400).json({ message: 'Incorect password'})
    }

    if (password == existingUser.password) {
        let token = jwt.sign(
            { id : user._id, role: user.role }, process.env.JWT_SECRET , 
            { expiresIn: process.env.JWT_EXPIRES_IN }      //what happens when JWT EXPIRES?
        )

    }

}



module.exports = {
    signup,
    login
}