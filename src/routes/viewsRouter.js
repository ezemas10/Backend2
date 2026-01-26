import { Router } from 'express'

import { passportCall } from '../middlewares/passportAuth.js'
import User from '../dao/mongodb/models/users.model.js'


const viewsRouter=Router()


viewsRouter.get("/", (req, res) => {
  res.redirect("/login");
});

viewsRouter.get('/login', (req, res) => {
    const error = req.query.error
    res.render('login', {error})
})

viewsRouter.get('/register', (req, res) => {
    const error = req.query.error
    res.render('register', {error})
})

viewsRouter.get('/failureLogin', (req, res) => {
    const error = req.query.error
    res.render('login', {error})
})

viewsRouter.get('/current', passportCall('jwt'), async (req, res) => {
    const user = await User.findById(req.user.id).lean()
    res.render('current', {user})
})


export default viewsRouter
