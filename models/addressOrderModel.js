const mongoose = require("mongoose")

const addressOrderSchema = mongoose.Schema(
  {
    country: {
      type: String,
      required: true
    },
    order: {
      type: Array,
      required: true
    }
  },
  {
    timestamps: true
  }
)