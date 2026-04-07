import FeatureFlag from "../models/FeatureFlag.js"

export const getTenantFlags = async (req, res) => {
  try {
    // const tenantId = req.user?.tenantId;   // ✅ FIX
   console.log("🔥 CONTROLLER HIT 🔥");
   const tenantId = "zayka-001"; // hardcode
console.log("TENANT ID:", tenantId);

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID missing" });
    }

    const flags = await FeatureFlag.find({
      tenantId,
      isDeleted: false
    })
      .select("flagKey name description isEnabled rolloutPercentage updatedAt") // ✅ FIX spelling
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      tenantId,
      flags,
    });

  } catch (error) {
    console.error("Get tenant flags error:", error.message);

    return res.status(500).json({
      message: "Server error while fetching tenant flags",
    });
  }
};