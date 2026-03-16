const mongoose = require('mongoose')

const connectDB = async ()=>{    //writing the connectn logic inside function so as to call it when server starts
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log('mongodb connected successfully')

    } catch (error) {
        console.log('MongoDB connected failed:', error.message)

        process.exit(1)   //process is a global object tat represents the running node program
    }
}

module.exports = connectDB