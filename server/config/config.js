import dotenv from "dotenv";
import { mongo } from "mongoose";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    PORT : z.string().default("3000"),
    JWT_SECRET : z.string().min(1, "JWT secret is required."),
    JWT_EXPIRES_IN : z.string.default('15m'),
    MONGO_URI : z.string().min(1, "MONGO URI is required."),
    REFRESH_TOKEN_EXPIRES_IN : z.string().default("7d")
})

//parsedenv mai object aata hai : success & data 
const parsedEnv = envSchema.safeParse(process.env) 

if (!parsedEnv.success){
    console.error("Invalid environment varibales")
    console.error(parsedEnv.error.format())
    process.exit(1)
}

export const config = {
    port : parsedEnv.data.PORT,
    jwtSecret : parsedEnv.data.JWT_SECRET,
    jwtExpiresIn : parsedEnv.data.JWT_EXPIRES_IN,
    mongoUri : parsedEnv.data.MONGO_URI,
    refreshTokenExpiresIn : parsedEnv.data.REFRESH_TOKEN_EXPIRES_IN
}