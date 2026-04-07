import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import connectDB from './database/db.js'
import { config } from './config/config.js'
import authRoutes from './routes/authRoutes.js'
import flagRoutes from "./routes/flagRoutes.js"
import tenantFlagRoutes from "./routes/tenantFlagRoutes.js"
import cookieParser from 'cookie-parser';
import healthRoutes from './routes/healthRoutes.js'
import { tenantAuth } from './middleware/tenantAuth.js'
dotenv.config()

const app = express()

app.use(cookieParser());

app.use(cors({
    origin:["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use("/api/flags", flagRoutes)
app.use('/health', healthRoutes)
app.use("/api/flags", tenantAuth, tenantFlagRoutes)

connectDB()

app.listen(config.port, ()=>{
    console.log(`Server running on port ${config.port}`)
})
