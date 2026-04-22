import Tenant from "../models/Tenant.js";

export const tenantAuth = async (req, res, next)=> {
    try {
        const clientKey = req.headers("x-client-key")

        if (!clientKey) {
            return res.status(401).json({
                message: "Missing x-client-key header"
            })
        }

        const tenant = await Tenant.findOne({ clientKey  }).select("+clientKey") //bydefault select false

        if (!tenant) {
            return res.status(401).json({
                message: "Invalid tenant credentials",
            });
        }

        req.tenant({  //modified the request object
            tenantId : tenant.tenantId,
            name: tenant.name
        })
        next()
    } catch (err) {
        console.error("Tenant auth error:", error.message);

        return res.status(500).json({
        message: "Server error during tenant authentication",
        });
    }
}    