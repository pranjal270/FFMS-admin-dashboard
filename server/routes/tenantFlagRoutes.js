import express from "express";
import { getTenantFlags } from "../controllers/tenantControllers.js";

const router = express.Router()

router.get("/", getTenantFlags);

export default router