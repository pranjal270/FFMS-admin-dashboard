import mongoose from 'mongoose'
import { config } from '../config/config.js'

const connectDB = async () => {    //writing the connectn logic inside function so as to call it when server starts
    try {
        mongoose.connect(config.mongoUri)
        console.log('mongodb connected successfully')

    } catch (error) {
        console.error('MongoDB connected failed:', error.message)

        process.exit(1)   //process is a global object tat represents the running node program
    } 
}

export default connectDB