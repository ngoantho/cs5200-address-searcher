const mongoose = require("mongoose")

const validationSchema = mongoose.Schema(
  {
    country: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    },
    county: {
      type: String,
      required: false
    },
    prefecture: {
      type: String,
      required: false
    },
    elevate_city: {
      type: Boolean,
      required: false
    },
    province: {
      type: String,
      required: false
    },
    state: {
      type: String,
      required: false
    },
  },
  {
    timestamps: true
  }
)

const validation = mongoose.model("validation", validationSchema, "validations")
module.exports = validation