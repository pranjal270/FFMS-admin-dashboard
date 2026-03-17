import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

import generateRecoveryCodes from '../utils/generateRecoveryCodes.js'

export const signup = async (req,res) => { 
    const { email, password } = req.body

    const existingUser = await User.findOne({email})

    if (existingUser) {
        return res.status(404).json({
            message: 'User already exists'
        })
    } 
    
    const hashedPassword = await bcrypt.hash( password, 10 )

    const recoveryCodes = generateRecoveryCodes()

    const user = new User ({
        email,
        password : hashedPassword,
        recoveryCodes
    })

    await user.save()

    res.status(201).json({
        message: 'Your sign-up has been successful.'
    })

}

export const login = async (req,res) => { 
    try {
        const {email , password } = req.body

        const user = User.findOne({email})

        if (!user) {
        return res.status(40).json( {message: 'Invalid essentials, please try with correct credentials'} )
        }

        const isMatch = await bcrypt.compare( password, user.Password)

        if (!isMatch) {
        return res.status(400).json({ message: 'Incorect password'})
        }

        let token = jwt.sign(
            { id : user._id, role: user.role }, process.env.JWT_SECRET , 
            { expiresIn: process.env.JWT_EXPIRES_IN }      //what happens when JWT EXPIRES?
        )

        if (!user.recoveryCodesShown) {
            user.recoveryCodesShown = true
            
            await user.save()

            return res.json({
                message: 'Login successful',
                token,
                recoveryCodes : user.recoveryCodes
            })
        }

        return res.json({
            message: 'Login successful',
            token
        })

        
    } catch (error){
        console.error(error)

        res.status(500).json({ 
            message: 'Server error'
        })
    }
}



export default {
    signup,
    login
}