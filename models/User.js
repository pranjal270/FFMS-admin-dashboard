const mongoose = require('mongoose') 

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

    roles: {
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

module.exports = mongoose.model('User', userSchema)