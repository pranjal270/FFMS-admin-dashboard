const mongoose = require("mongoose");

const recoverySchema  = new mongoose.Schema({
    code: String,
    used: {type: Boolean, default: False}
})

const userSchema = new mongoose.Schema({
    email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["admin","customer"],
    default: "customer"
  },

  recoveryCodes: [recoverySchema],

  recoveryCodesShown: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model("User", userSchema);