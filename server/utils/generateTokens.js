import jwt from 'jsonwebtoken'
import crypto from 'crypto';
import { config } from '../config/config.js'   

export const generateAccessToken = (user) => {
    return jwt.sign({
        id: user._id,
        role: user.role,  //we keep role so that it is more clear that it is a admin only route 
        tenantId: user.tenantId,
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

export const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest('hex')
}