const mongoose = require("mongoose")

const prodSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
  },
  cost: {
    type: Number,
  },
  description: {
    type: String,
  },
  quantity: {
    type: Number,
    default: 1,
  },
})

const prodDB = mongoose.connection.useDb("prodDB")
const LikedProd = prodDB.model("productsLiked", prodSchema)

module.exports = LikedProd
