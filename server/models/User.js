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
        unique: true,
        trim: true, //remove ectrac spaces
        lowercase: true 
    } ,

    password: {
        type:String,
        required: true
    },

    tenantId: {
        type: String ,
        trim : true,
        required: true
    },

    role: {
        type:String,
        enum: ['admin'],
        default: 'admin'
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