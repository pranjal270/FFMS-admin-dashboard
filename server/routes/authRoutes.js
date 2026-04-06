import express from 'express'
const router = express.Router()

import { 
    login ,
    test,
    generateRecoveryCodes,
    verifyRecoveryCodes,
    refreshAccessToken,
    me,
    logout
} from '../controllers/authControllers.js'

import { protect, adminOnly } from '../middleware/authMiddleware.js'


// router.post('/signup', signup)
router.post('/login', login) 
router.get('/generate-recovery-codes', protect , generateRecoveryCodes)
router.post("/verify-recovery-code", verifyRecoveryCodes);
router.get("/me", protect, me);
router.get("/test", protect, test);
router.post('/refresh', refreshAccessToken)
router.post('/logout', logout)

export default router
