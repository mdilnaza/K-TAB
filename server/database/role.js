const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema({
  value: {
    type: String,
    unique: true,
    default: "USER",
  },
})

const userDB = mongoose.connection.useDb("userDB")
const Role = userDB.model("role", roleSchema)

module.exports = Role
