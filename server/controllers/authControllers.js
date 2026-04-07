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
import ResetToken from "../models/passwordResetToken.js";
import { config } from '../config/config.js'



export const login = async (req,res) => { 
    try {
        const {email , password } = req.body

        if ( !email || !password){
            return res.status(400).json({
                message : 'Email and password are required.'
            })
        }

        const user = await User.findOne({email : email.toLowerCase().trim() })
 
        if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json( {message: 'Invalid credentials, please try with correct credentials'} )
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken();    
        const hashedToken = hashToken(refreshToken);

        const expiresAt = new Date(
            Date.now() +  7 * 24 * 60 * 60 * 1000  //replace with cnfig baadme //aaj se 7 din baad 
        )

        await RefreshToken.create({          //add refreshtoken in db
            user: user._id,
            token: hashedToken,
            expiresAt
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly : true,  //js se directly access nahi ho paega
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
                role: user.role,
                tenantId: user.tenantId
            }
        })

        
    } catch (error){
        console.error("Login error:", error.message)

        return res.status(500).json({ 
            message: 'Server error'
        })
    }
}

export const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies

        if (!refreshToken) {
           return res.status(401).json({message: "Refresh Token not found"})
        }

        const hashedToken = hashToken(refreshToken)
        const tokenDoc = await RefreshToken.findOne({ token: hashedToken})

        if (!tokenDoc) {
            return res.status(401).json({
                message: "Invalid refresh token "
            })
        }

        const user = await User.findById(tokenDoc.user)

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            })
        }

        const accessToken = generateAccessToken(user)

        return res.status(200).json({
            accessToken,
            user: {  // why sending agin user dtaa 
                id: user._id, 
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
            }
        })

    } catch (error) {
        console.log(`Refresh Token error: ${error.message}`)

        return res.status(500).json({
            message: "Server error",
        });
    }
}

export const generateRecoveryCodes = async (req,res)  =>{
    try {
        const userId = req.user?.id  //from protect middleware we will get the user id
        if (!userId) {
      return res.status(401).json({
        message: "Invalid or expired token"
      })
    }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const rawCodes = Array.from({ length :  8 }, ()=>{
            crypto.randomBytes(4).toString("hex")
        })

        const hashedCodes = rawCodes.map((code) => 
            ({ code: hashToken(code) , used : false}) //implicit return
        ) //hash the code to store in db

        user.recoveryCodes = hashedCodes
        // user.recoveryCodesShown = true;
        await user.save()

        return res.status(200).json({
            message: "Recovery Codes generated",
            recoveryCodes : rawCodes
        })
    } catch (error) {
        console.error("Generate recovery codes error:", error.message)
        return res.status(500).json({
            message: "Server error"
        })
    }
}

export const verifyRecoveryCodes = async (req, res) => {
    try {
        const { email , code } = req.body

        if ( !email || !code ) {
            return res.status(400).json({
                messgae: "Email and Code are required."
            })
        }
        const user = await User.findOne({email : email.toLowerCase().trim()})

        if (!user || !user.recoveryCodes?.length) {
            return res.status(400).json({
                message: "Invalid request."
            })
        }

        const hashedInput = hashToken(code)
        const index = user.recoveryCodes.findIndex(
            (item) => item.code === hashedInput && item.used === false
        )

        if (index === -1){
            return res.status(400).json({
                message: "Invalid Recovery Code"
            })
        }

        user.recoveryCodes.splice(index , 1) //removed used recovery code
        await user.save()

        const resetToken = crypto.randomBytes(32).toString("hex")
        const hashedResetToken = hashToken(resetToken)

        await ResetToken.create({
                user: user._id,
                token: hashedResetToken,
                expiresAt: Date.now() + 15 * 60 * 1000 //15 min
        })

        return  res.status(200).json({
            message: "Recovery code verified successfully",
            resetToken
        })    
    } catch (error) {
        console.error("Verify recovery code error:", error.message);
        return res.status(500).json({
            message: "Server error"
        })
    } 
}

export const me = async ( req, res) =>{ 
    try {
        const user = await User.findById(req.user.id , { password:0})

        if (!user) {
            return res.status(404).json({
                message: "User not found",
             });
        }

        return res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
            },
        });
    }  catch (error) {
            console.error("Me route error:", error.message);

            return res.status(500).json({
                message: "Server error",
            });
        }
}

export const logout = async (req, res) => {

    try {
        const refreshToken = req.cookies?.refreshToken  

        if (refreshToken) {
            const hashedRefreshToken = hashToken(refreshToken)
            
            await RefreshToken.findOneandDelete({token: hashedRefreshToken})
        }   

        res.clearCookie( "refreshToken" , {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        })  

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Server error during logout" });
  }
};  


export const test = async (req,res) =>{
    return res.json({message:'YAY route chal gaya uyuwwuwuw', user: req.user})
}

// export const signup = async (req,res) => { 
//     try {
//         const { email, password } = req.body

//         if (!email || !password) {
//             return res.status(400).json({
//                 message: "Email and password required."
//             })
//         }

//         const existingUser = await User.findOne({email})

//         if (existingUser) {
//             return res.status(404).json({
//                 message: 'User already exists'
//             })
//         } 
        
//         const hashedPassword = await bcrypt.hash( password, 10 ) //10 here is number of salt rounds

//         const user = new User ({
//             email,
//             password : hashedPassword,
//         })

//         await user.save()

//         res.status(201).json({
//             message: 'Your sign-up has been successful.'
//         })
//     } catch (error) {
//         console.error("Signup error", error.message)

//         res.status(500).json({
//             message: "Server Error  "
//         })
//     }

// }
export default {
    signup,
    login,
    test
}