const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: [
    {
      type: String,
      ref: "Role",
    },
  ],
  products: [
    {
      idProd: { type: String },
      quantity: { type: Number, default: 1 },
    },
  ],
})

const userDB = mongoose.connection.useDb("userDB")
const User = userDB.model("user", userSchema)

module.exports = User
