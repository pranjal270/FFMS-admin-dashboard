import mongoose from "mongoose";
import crypto from "crypto"


const tenantSchema = new mongoose.Schema(
    {
        tenantId : {
            type: String,   
            required : true,
            unique: true,
            trim: true
        },

        name : {
            type: String,
            required: true,
            trim: true
        },

        clientKey: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            select: false,
            default: () => crypto.randomBytes(32).toString("hex")
        },
    },
    { timestamps: true}
)

const Tenant = mongoose.model( "Tenant", tenantSchema)
export default Tenant;