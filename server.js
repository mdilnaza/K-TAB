
const express = require("express")
const app = express()
const path = require("path")
const morgan = require("morgan")
const bodyparser = require("body-parser")
const session = require("express-session")
const cookie = require("cookie-parser")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const { validationResult } = require("express-validator")
const { secret } = require("./config")

const port = process.env.PORT || 3001

mongoose
  .connect("mongodb+srv://admin:admin123@cluster0.dmu1j.mongodb.net/users?retryWrites=true&w=majority", {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err))

generateAccessToken = (id, role) => {
  const payload = {
    id,
    role,
  }
  return jwt.sign(payload, secret, { expiresIn: "24h" })
}

app.use(morgan("tiny"))
app.use(cookie())

// app.locals.errors=null;

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

// app.use(expressValidator());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
)

app.use(require("connect-flash")())
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

app.set("view engine", "ejs")
console.log(app.get("views"))

app.get("*", function (req, res, next) {
  res.locals.cart = req.session.cart
  next()
})

//using router
const Router = require("./server/routes/router")

app.use(Router)

app.use("/css", express.static(path.resolve(__dirname, "assets/css")))
app.use("/img", express.static(path.resolve(__dirname, "assets/img")))
app.use("/js", express.static(path.resolve(__dirname, "assets/js")))

app.listen(port, () => {
  console.log("Listening to port 3001")
})
