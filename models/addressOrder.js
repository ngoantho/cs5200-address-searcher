const mongoose = require("mongoose")

const schema = mongoose.Schema(
  {
    country: {
      type: String,
      required: true
    },
    order: [String]
  },
  {
    timestamps: true
  }
)

const addressOrder = mongoose.model("addressOrder", schema, "addressOrder")
module.exports = addressOrder