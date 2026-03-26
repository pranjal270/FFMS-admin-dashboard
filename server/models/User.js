import mongoose from 'mongoose'

const recoveryCodeSchema = new mongoose.Schema({
    code: String,
    used: {
        type:Boolean,
        default: false
    }
})

const userSchema = new mongoose.Schema({

    email: {
        type:String,
        required: true,
        unique: true
    } ,

    password: {
        type:String,
        required: true
    },

    role: {
        type:String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },

    recoveryCodes: [recoveryCodeSchema],

    recoveryCodesShown: {
        type:Boolean,
        default: false
    }

})

const User = mongoose.model('User', userSchema)
export default User
// module.exports = mongoose.model('User', userSchema)