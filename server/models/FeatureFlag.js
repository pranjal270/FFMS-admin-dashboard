import mongoose from "mongoose";

const featureFlagSchema = new mongoose.Schema(
  {
    tenantId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    }, 

    flagKey: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    isEnabled: {
      type: Boolean,
      default: false,
    },

    rolloutPercentage: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    }, 
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    } 
  },
  { timestamps: true }
);

featureFlagSchema.index(
  { tenantId: 1, flagKey: 1},
  { unique: true,
  partialFilterExpression : { isDeleted : false},
  } 
)

export default mongoose.model("FeatureFlag", featureFlagSchema);