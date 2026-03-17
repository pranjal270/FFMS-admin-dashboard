const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('mongodb cinnected')

    } catch (error) {
        console.error('error occured')
        process.exit(1)
    }
}