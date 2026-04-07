import { string } from "zod";
import FeatureFlag from "../models/FeatureFlag.js";

//listflags

export const listFlags = async (req, res) => {
    try {
        const flags = await FeatureFlag.find({
            tenantId : req.user.tenantId, //identify from middleware 
            isDeleted: false
        }).sort({ createdAt : -1})

        return res.status(200).json({
            tenantId: req.user.tenantId,
            flags,
        });
    } catch (error) {
        console.error("List flags error:", error.message);

        return res.status(500).json({
            message: "Server error while fetching flags",
        });
    }
} 

export const createFlag = async ( req, res) => {
    try {
       const { flagKey, name, description, rolloutPercentage, isEnabled } = req.body

       if (!flagKey || !name) {
        return res.status(400).json({
            message: "flagKey and name are required",
        });
        }

        const existingFlag = await FeatureFlag.findOne({
            tenantId: req.user.tenantId,
            flagKey: flagKey.trim(),
            isDeleted: false,
        })  

        if (existingFlag) {
            return res.status(409).json({
                message: "This flagkey already exits for this tenant"
            })
        }

        const newFlag = await FeatureFlag.create({
            tenantId: req.user.tenantId,
            flagKey: flagKey.trim(),
            name: name.trim(),
            description: description ? description.trim() : "",
            rolloutPercentage: 
            typeof rolloutPercentage === "number" 
                ? rolloutPercentage 
                : Number(rolloutPercentage) || 100,
            isEnabled: typeof isEnabled === "boolean" ? isEnabled : false
        })

        return res.status(201).json({
            message: "Flag created successfully",
            flag: newFlag,
        })
    } catch (error) {
        console.error("Ceate flag error:", error.message)

        return res.status(500).json({
            message: "Server error while creating flag",
        })
    }

}

export const updateFlag = async ( req , res) => {
    try {
        const flagId = req.params
        const { name , description, rolloutPercentage} = req.body

        const flag = await FeatureFlag.findOne({
           _id: flagId ,
           tenantId : req.user.tenantId,
           isDeleted: false
        })

        if (!flag) {
            return res.status(404).json({
                message: "Flag not found for this tenant",
            });
        }

        if ( typeof name === "string" ) {
            flag.name = name.trim()
        }

        if ( typeof description === "string" ) {
            flag.description = description.trim()
        }

        if ( typeof rolloutPercentage !== "undefined" ) {
            flag.rolloutPercentage = Number(rolloutPercentage)
        }

        await flag.save()

        return res.status(200).json({
            message: "Flag updated successfully",
            flag,
        });
    } catch (error) {
        console.error("Update flag error:", error.message);

        return res.status(500).json({
            message: "Server error while updating flag",
    })
    }
}

export const toggleFlag = async (req, res) => {
    try {
        const flagId = req.params

        const flag = FeatureFlag.findOne({
            tenantId : req.user.tenantId,
            _id: flagId,
            isDeleted: false
        })

        if (!flag) {
            return res.status(409).json({
                message: "Flag not found for this tenant"
            })
        }

        flag.isEnabled = !flag.isEnabled

        await flag.save()

        return res.status(200).json({
            message: "Flag toggled successfully",
            flag,
        });
    } catch (error) {
        console.error("Toggle flag error:", error.message);

        return res.status(500).json({
            message: "Server error while toggling flag",
        });
    }
}

export const softDeleteFlag = async (req, res) => {
    try {
        const flagId = req.params

        const flag = await FeatureFlag.findOne({
            _id: flagId,
            tenantId: req.user.tenantId,
            isDeleted: false
        })

        if (!flag) {
            return res.status(404).json({
                message: "Flag not found for this tenant",
            });
        }
        
        flag.isDeleted = true

        await flag.save()

        return res.status(200).json({
            message: "Flag deleted successfully",
        });

    } catch (error) {
        console.error("Delete flag error:", error.message);

        return res.status(500).json({
        message: "Server error while deleting flag",
        });
    }
}