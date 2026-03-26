import mongoose from "mongoose";

const featureFlagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    enabled: {
      type: Boolean,
      default: false,
    },

    rollout: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },

    targetType: {
      type: String,
      enum: ["all", "user", "role"],
      default: "all",
    },

    targetUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    targetRoles: [
      {
        type: String,
        enum: ["admin", "customer"],
      },
    ],

    description: {
      type: String,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);


featureFlagSchema.index({ name: 1, projectId: 1 }, { unique: true });

export default mongoose.model("FeatureFlag", featureFlagSchema);