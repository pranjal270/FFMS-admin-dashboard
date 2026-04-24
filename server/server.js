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
    origin:["https://ffms-admin-dashboard.vercel.app", "http://localhost:5173", "http://localhost:5174", "https://zayka-gules.vercel.app/"],
    credentials: true,
    methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders:["Content-Type","Authorization","X-Client-Key"]
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use("/api/flagit/flags", flagRoutes) //admin
app.use('/health', healthRoutes)

app.use("/api/flags",tenantAuth, tenantFlagRoutes) //tenant routes
app.get("/check", (req, res) => {
  res.send("FFMS RUNNING ✅");
});

app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

connectDB()

app.listen(config.port, ()=>{
    console.log(`Server running on port ${config.port}`)
})
