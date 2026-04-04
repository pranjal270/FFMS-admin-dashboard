import express from 'express'
const router = express.Router()

import { signup, login , test, generateRecoveryCodes, refreshAccessToken } from '../controllers/authControllers.js'
import { protect, adminOnly } from '../Middleware/authMiddleware.js'


router.post('/signup', signup)
router.post('/login', login) 
router.get('/generate-recovery-codes', protect , generateRecoveryCodes)
router.post('/refresh', refreshAccessToken)

export default router
