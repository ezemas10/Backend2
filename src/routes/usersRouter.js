import { Router } from "express";
import bcrypt from "bcrypt"
import User from "../models/User.js"
import { loginUser, logoutUser, registerUser } from '../controllers/userController.js'

const router = Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/logout', logoutUser)


function sinPass(user) {

    if (!user) return null

    return {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart
    }

}



router.get("/:uid", async (req, res) => {

    try {
        let { uid } = req.params

        let user = await User.findById(uid).lean()

        if (!user) {
            return res.status(404).send({
                message: "usuario no encontrado"
            })
        }

        res.send({
            usuario: sinPass(user)
        })
    } 
    
    catch(error){

    console.log(error)

    res.status(500).send("Internal Server Error");

    }

})



router.get("/", async (req, res) => {

    try {
        let users = await User.find().lean()
        let usuario = users.map(sinPass)

        res.send({
                usuario
        })
    } 
    
    catch(error){

    console.log(error)

    res.status(500).send("Internal Server Error");

  }

})

router.post("/", async (req, res) => {

    try {

        let { first_name, last_name, email, age, password, role, cart } = req.body

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).send({

                message: "Todos los campos son obligatorios"
            
            })
        }

        let exists = await User.findOne({ email })

        if (exists) {
            return res.status(400).send({
                
                message: "Email ya existe"

            })
        }

        let pass = bcrypt.hashSync(password, 10)

        let newUser = await User.create({
            first_name,
            last_name,
            email,
            age,
            password: pass,
            role: role || "user",
            cart: cart || null
        })

        res.status(201).send({
            
            usuario: sinPass(newUser.toObject())

        })

    } 
    
    catch(error){

    console.log(error)

    res.status(500).send("Internal Server Error");

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

        let actualizado = await User.findByIdAndUpdate(uid, usuario, { new: true }).lean()

        if (!actualizado) {
            return res.status(404).send({
                
                message: "Usuario no encontrado"

            })
        }

        res.send({
           
            usuario:sinPass(actualizado)

        })

    } 
    
    catch(error){

    console.log(error)

    res.status(500).send("Internal Server Error");

     }

})


router.delete("/:uid", async (req, res) => {

    try {
        
        let { uid } = req.params
        let actualizado = await User.findByIdAndDelete(uid).lean()

        if (!actualizado) {
            return res.status(404).send({
                
                message: "Usuario no encontrado"

            })
        }

        res.send({
            
            usuario:sinPass(actualizado)

        })
    } 
    
        catch(error){

        console.log(error)

        res.status(500).send("Internal Server Error");

    }
})

export default router