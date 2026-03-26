import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto';
import RefreshToken from '../models/RefreshToken.js'
import { 
    generateAccessToken,
    generateRefreshToken,
    hashToken
} from '../utils/generateTokens.js'
import { config } from '../config/config.js'



export const signup = async (req,res) => { 
    const { email, password } = req.body

    const existingUser = await User.findOne({email})

    if (existingUser) {
        return res.status(404).json({
            message: 'User already exists'
        })
    } 
    
    const hashedPassword = await bcrypt.hash( password, 10 ) //10 here is number of salt rounds

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

        if ( !email || !password){
            return res.status(400).json({
                message : 'Email and password are required.'
            })
        }

        const user = await User.findOne({email})

        if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json( {message: 'Invalid credentials, please try with correct credentials'} )
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken();
        const hashedToken = hashToken(refreshToken);

        const expiresAt = new Date(
            Date.now() +  7 * 24 * 60 * 60 * 1000  //replace with cnfig baadme
        )

        await RefreshToken.create({          //add refreshtoken in db
            user: user._id,
            token: hashedToken,
            expiresAt
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: expiresAt
        })

        return res.json({
            message: 'Login successful',
            accessToken,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        })

        
    } catch (error){
        console.error(error)

        res.status(500).json({ 
            message: 'Server error'
        })
    }
}

// export const generateRecoveryCodes = async (req,res)  =>{
//     try {
//         const userId = req.user.id  //from protext middleware

//         const rawcodes = 

//     }
// }

export const test = async (req,res) =>{
    return res.json({message:'YAY route chal gaya uyuwwuwuw', user: req.user})
}




export default {
    signup,
    login,
    test
}