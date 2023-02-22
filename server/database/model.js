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
})

const prodDB = mongoose.connection.useDb("prodDB")
const Prod = prodDB.model("products", prodSchema)

module.exports = Prod
