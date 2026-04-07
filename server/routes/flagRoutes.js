import express from "express";
import {
    listFlags,
    createFlag,
    updateFlag,
    toggleFlag,
    softDeleteFlag
} from "../controllers/flagController.js"

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router()

router.get("/", protect, adminOnly, listFlags);
router.post("/", protect, adminOnly, createFlag);
router.patch("/:flagId", protect, adminOnly, updateFlag);
router.patch("/:flagId/toggle", protect, adminOnly, toggleFlag);
router.delete("/:flagId", protect, adminOnly, softDeleteFlag);


export default router