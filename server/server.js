import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import connectDB from './database/db.js'
import { config } from './config/config.js'
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser';
dotenv.config()

const app = express()

app.use(cookieParser());

app.use(cors({
    origin:"https://your-frontend.vercel.app",
    credentials: true
}))

app.use(express.json())

app.use('/api/auth', authRoutes)

connectDB()

app.listen(config.port, ()=>{
    console.log(`Server running on port ${config.port}`)
})
