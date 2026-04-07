import express from "express";
import mongoose from "mongoose";

const passwordResetTokenSchema = new mongoose.Schema(
    {
    user : {
        type:  mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    token : {
        type: String,
        required: true
    },
    expiresAt : {
        type: Date,
        required: true
    }
    }, 
    { timestamps: true}
)

passwordResetTokenSchema.index({ expiresAt : 1}, {expiresAfterSeconds : 0})

const ResetToken = mongoose.model( "ResetToken", passwordResetTokenSchema)

export default ResetToken;