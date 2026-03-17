import express from 'express'
const router = express.Router()

import { signup, login } from '../controllers/authControllers.js'
import { protect, adminOnly } from '../middleware/authmiddleware.js'


router.post('/singup', protect, signup)
router.post('/login', protect, login) 

export default router


 
