import { Router } from "express"
import bcrypt from "bcrypt"
import { loginUser, logoutUser, registerUser } from "../controllers/userController.js"
import { userService } from "../services/user.service.js"

const router = Router()

router.post("/register", registerUser)

router.post("/login", loginUser)

router.get("/logout", logoutUser)

function sinPass(user) {
  if (!user) return null

  return {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    age: user.age,
    role: user.role,
    cart: user.cart,
  }
}

router.get("/:uid", async (req, res) => {
  try {
    let { uid } = req.params

    let user = await userService.getUserById(uid)

    if (!user) {
      return res.status(404).send({
        message: "Usuario no encontrado",
      })
    }

    res.send({
      usuario: sinPass(user),
    })
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error")
  }
})

router.get("/", async (req, res) => {
  try {
    let users = await userService.getAll()
    let usuario = users.map(sinPass)

    res.send({
      usuario,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error")
  }
})

router.post("/", async (req, res) => {
  try {
    let { first_name, last_name, email, age, password, role, cart } = req.body

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).send({
        message: "Todos los campos son obligatorios",
      })
    }

    let exists = await userService.getByEmail(email)

    if (exists) {
      return res.status(400).send({
        message: "Email ya existe",
      })
    }

    let pass = bcrypt.hashSync(password, 10)

    let newUser = await userService.create({
      first_name,
      last_name,
      email,
      age,
      password: pass,
      role: role || "user",
      cart: cart || null,
    })

    res.status(201).send({
      usuario: sinPass(newUser),
    })
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error")
  }
})

router.put("/:uid", async (req, res) => {
  try {
    let { uid } = req.params
    let { first_name, last_name, email, age, password, role, cart } = req.body

    let usuario = {}

    if (first_name !== undefined) usuario.first_name = first_name
    if (last_name !== undefined) usuario.last_name = last_name
    if (email !== undefined) usuario.email = email
    if (age !== undefined) usuario.age = age
    if (role !== undefined) usuario.role = role
    if (cart !== undefined) usuario.cart = cart

    if (password !== undefined && password !== "") {
      usuario.password = bcrypt.hashSync(password, 10)
    }

    let actualizado = await userService.update(uid, usuario)

    if (!actualizado || actualizado.matchedCount === 0) {
      return res.status(404).send({
        message: "Usuario no encontrado",
      })
    }

    let user = await userService.getUserById(uid)

    res.send({
      usuario: sinPass(user),
    })
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error")
  }
})

router.delete("/:uid", async (req, res) => {
  try {
    let { uid } = req.params

    let eliminado = await userService.delete(uid)

    if (!eliminado || eliminado.deletedCount === 0) {
      return res.status(404).send({
        message: "Usuario no encontrado",
      })
    }

    res.send({
      status: "success",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error")
  }
})

export default router
