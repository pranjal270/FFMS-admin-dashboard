import jwt from 'jsonwebtoken'
import crypto from 'crypto';
import { config } from '../config/config.js'   

export const generateAccesstoken = (user) => {
    return jwt.sign({
        id: user._id,
        role: user.role,
        },
        config.jwtSecret,
        {
            expiresIn: config.jwtExpiresIn
        }
    )
}

export const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
}

export const HashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest('hex  ')
}