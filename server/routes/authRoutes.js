import express from 'express'
const router = express.Router()

import { signup, login , test } from '../controllers/authControllers.js'
import { protect, adminOnly } from '../middleware/authmiddleware.js'


router.post('/signup', signup)
router.post('/login', login) 
router.get('/test', protect, test)

export default router