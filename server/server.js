import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import connectDB from './database/db.js'
import { config } from './config/config.js'
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser';
import healthRoutes from './routes/healthRoutes.js'
dotenv.config()

const app = express()

app.use(cookieParser());

app.use(cors({
    origin:["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}))

app.use(express.json())

app.use('/api/auth', authRoutes)

app.use('/health', healthRoutes)

connectDB()

app.listen(config.port, ()=>{
    console.log(`Server running on port ${config.port}`)
})
