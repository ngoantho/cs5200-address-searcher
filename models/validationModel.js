const mongoose = require("mongoose")

const validationSchema = mongoose.Schema(
  {
  },
  {
    timestamps: true
  }
)

const validation = mongoose.model("validation", validationSchema, "validation")
module.exports = validation