import express from 'express'
import { passportCall } from '../middlewares/passportAuth.js'
import User from '../models/User.js'

const router = express.Router()

router.get('/current', passportCall('jwt'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).lean()

        if (!user) {
            return res.status(404).send({
                
                message: 'Usuario no encontrado'

            })
        }

        return res.send({
            
            payload: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                role: user.role,
                cart: user.cart
            }

        })

    } 
    
    catch(error){

    console.log(error)

    res.status(500).send("Internal Server Error");

    }
    
})

export default router

