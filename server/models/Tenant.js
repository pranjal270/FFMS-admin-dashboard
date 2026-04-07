import mongoose from "mongoose";


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
        },
    },
    { timestamps: true}
)

const Tenant = mongoose.model( "Tenant", tenantSchema)
export default Tenant;