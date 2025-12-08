import express from 'express'
import { passportCall } from '../middlewares/passportAuth.js'
import User from '../models/User.js'

const router = express.Router()

router.get('/current', passportCall('jwt'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).lean()

        if (!user) {
            return res.status(404).send({
                status: 'error',
                message: 'Usuario no encontrado'
            })
        }

        return res.send({
            status: 'success',
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
    } catch (err) {
        return res.status(500).send({
            status: 'error',
            message: err.message
        })
    }
})

export default router

