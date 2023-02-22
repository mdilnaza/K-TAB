const express = require("express")
const cookie = require("cookie-parser")
const route = express.Router()
const Prod = require("../database/model")
const User = require("../database/user")
const Role = require("../database/role")
const LikedProd = require("../database/userModel")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator")
const { collection } = require("../database/userModel")

route.get("/", function (req, res) {
  res.render("index", {})
})
route.get("/homepage", function (req, res) {
  res.render("homepage")
})
route.get("/homeAdmin", async function (req, res) {
  res.render("homeAdmin")
})

route.get("/logout", function (req, res, next) {
  res.clearCookie("total")
  res.clearCookie("username")
  res.clearCookie("userRole")

  var db = mongoose.connection.useDb("prodDB")
  db.collection("productslikeds").drop()

  res.redirect("/")
})

route.post("/login", async (req, res) => {
  try {
    const { usernameLog, passwordLog } = req.body
    const user = await User.findOne({ username: usernameLog })
    if (!user) {
      return res.status(400).json({ message: "The user is not found" })
    }
    const validPassword = bcrypt.compareSync(passwordLog, user.password)
    if (!validPassword) {
      return res.status(400).json({ message: "Wrong password" })
    }
    const token = generateAccessToken(user._id, user.role)
    if (user.role == "ADMIN") {
      res.status(201).render("homeAdmin")
    } else {
      res.cookie("userRole", user.role)
      res.cookie("username", usernameLog)
      res.status(201).render("homepage")
    }
  } catch (err) {
    console.log(err)
  }
})

route.get("/register", function (req, res) {
  res.render("registration")
})

route.post("/register", async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Registration error", errors })
    }
    const { usernameReg, emailReg, passwordReg } = req.body
    const user = await User.findOne({ username: usernameReg })
    if (user) {
      return res.status(400).json({ message: "Username is already created" })
    }
    const e = await User.findOne({ email: emailReg })
    if (e) {
      return res.status(400).json({ message: "Email is already in use" })
    }
    res.cookie("username", usernameReg)
    const hashPassword = bcrypt.hashSync(passwordReg, 7)
    const userRole = await Role.findOne({ value: "USER" })
    const registerUser = new User({
      username: usernameReg,
      email: emailReg,
      password: hashPassword,
      role: [userRole.value],
    })
    registerUser.save()

    res.status(201).render("homepage")
  } catch (err) {
    console.log(err)
  }
})

route.get("/prodPage", function (req, res) {
  Prod.find(function (err, prods) {
    if (err) {
      console.log(err)
    }
    res.render("prodPage", {
      prods: prods,
    })
  })
})

route.get("/products", function (req, res) {
  Prod.find(function (err, prods) {
    if (err) {
      console.log(err)
    }
    res.render("product_page", {
      prods: prods,
    })
  })
})

route.post("/add-to-cart/:id", function (req, res) {
  Prod.findOne({ _id: req.params.id }, function (err, prod) {
    if (err) console.log(err)

    LikedProd.findOne({ name: prod.name }, function (err, lProd) {
      if (err) console.log(err)

      if (lProd) {
        LikedProd.findOneAndUpdate(
          { name: prod.name },
          {
            $inc: {
              quantity: 1,
            },
          },
          function (err, likProd) {
            if (err) console.log(err)
          }
        )
      } else {
        const likedProd = new LikedProd({
          name: prod.name,
          cost: prod.cost,
          description: prod.description,
          image: prod.image,
        })

        likedProd.save()

        res.redirect("/products")
      }
    })
  })
})

route.get("/cart", function (req, res) {
  LikedProd.find({}, function (err, prod) {
    if (err) console.log(err)

    var total = 0

    prod.forEach(function (prods) {
      total = total + prods.quantity * prods.cost
      res.cookie("total", total)
    })
    res.render("cart", { prods: prod, total: req.cookies.total })
  })
})

route.get("/admin", function (req, res) {

  const count = Prod.count();
  console.log(count);

  Prod.find(function (err, prods) {
    res.render("admin", {
      prods: prods
    })
  })
})

route.get("/add_prod", function (req, res) {
  res.render("add_prod")
})

route.post("/add_prod", function (req, res) {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty" })
    return
  }
  const prods = new Prod({
    image: req.body.image,
    name: req.body.name,
    cost: req.body.cost,
    description: req.body.description,
  })
  prods
    .save()
    .then((data) => {
      // res.send(data)
      res.redirect("/add_prod")
    })
    .catch((err) => {
      console.log(err)
    })
})

route.get("/update_prod", function (req, res) {
  console.log(req.query.id)
  Prod.findOne({ _id: req.query.id }, function (err, prods) {
    if (err) {
      return console.log(err)
    }
    res.render("update_prod", {
      image: prods.image,
      name: prods.name,
      cost: prods.cost,
      description: prods.description,
      id: prods._id,
    })
  })
})

route.put("/update_prod/:id", function (req, res) {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" })
  }
  const id = req.params.id
  Prod.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot Update product with ${id}. Maybe user not found!`,
        })
      } else {
        res.send(data)
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error Update product information" })
    })
})

route.get("/delete_prod")

route.delete("/delete_prod/:id", function (req, res) {
  const id = req.params.id

  Prod.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` })
      } else {
        res.send({
          message: "Product was deleted successfully!",
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete product with id=" + id,
      })
    })
})

route.get("/users", function (req, res) {
  User.find({})
    .sort({ sorting: 1 })
    .exec(function (err, users) {
      res.render("users", {
        users: users,
      })
    })
})
route.get("/add_user", function (req, res) {
  const username = ""
  const email = ""
  const password = ""
  const role = ""
  const errors = req.session.errors

  res.render("add_user", {
    username: username,
    email: email,
    password: password,
    role: role,
    errors: errors,
  })
  req.session.errors = null
})

route.post("/add_user", function (req, res) {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty" })
    return
  }
  const users = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  })
  users
    .save(users)
    .then((data) => {
      // res.send(data)
      res.redirect("/add_user")
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error",
      })
    })
})
route.get("/update_user", function (req, res) {
  User.findOne({ _id: req.query.id }, function (err, users) {
    if (err) {
      return console.log(err)
    }
    res.render("update_user", {
      username: users.username,
      email: users.email,
      password: users.password,
      role: users.role,
      id: users._id,
    })
  })
})

route.put("/update_user/:id", function (req, res) {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" })
  }
  const id = req.params.id
  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot Update user with ${id}. Maybe user not found!`,
        })
      } else {
        res.send(data)
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error Update user information" })
    })
})
route.get("/delete_user")

route.delete("/delete_user/:id", function (req, res) {
  const id = req.params.id

  User.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` })
      } else {
        res.send({
          message: "User was deleted successfully!",
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete user with id=" + id,
      })
    })
})

module.exports = route
