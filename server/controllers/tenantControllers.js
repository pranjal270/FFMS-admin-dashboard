import FeatureFlag from "../models/FeatureFlag.js"

export const getTenantFlags = async (req,res) => {
    try {
        const flags = await FeatureFlag.find(
            { tenantId: req.tenant.tenantId , isDeleted: false}
        )
        .select(" flagkey name description isEnabled rolloutPercentage updatedAt")
        .sort({ updatedAt : -1})

        return res.status(200).json({
            tenantId: req.tenant.tenantId,
            flags,
        });
    } catch (error) {
        console.error("Get tenant flags error:", error.message);

        return res.status(500).json({
            message: "Server error while fetching tenant flags",
            });
    }   
}