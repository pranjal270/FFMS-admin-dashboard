import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'

export const protect = (req,res,next) => {
        const authHeader = req.headers.authorization

        if ( !authHeader || !authHeader.startsWith('Bearer')) {  //the token that is sent , looks like this:Authorization: Bearer <token>
            return res.status(401).json({message: 'No token found'})
        }
        const accToken = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(accToken, config.jwtSecret)
        req.user = decoded
        next()
    } catch(error) {
        res.status(401).json({ message: 'Invalid or expired token'})
    }
}

export const adminOnly = (req,res,next) =>{
    if (req.user.role !== "admin"){
        res.status(403).json({ message : 'Access Denied'})   
    }
    next(); 
}

//may feel redundant but  code becomes clearer route intent becomes obvious