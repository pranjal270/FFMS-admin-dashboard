import jwt from 'jsonwebtoken'

export const protect = (req,res,next) => {
        const authHeader = req.headers.authorization

        if ( !authHeader || !authHeader.startsWith('bearer')) {  //the token that is sent , looks like this:Authorization: Bearer <token>
            res.status(401).json({message: 'No token found'})
        }
        const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch(error) {
        res.status(401).json({ message: 'Invalid or expired token'})
    }
}

export const adminOnly = (req,res,next) =>{
    if (req.user.role !== admin){
        res.status(403).json({ message : 'Access Denied'})
    }
}

