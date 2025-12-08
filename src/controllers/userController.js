import User from "../models/User.js";
import bcrypt from 'bcrypt'
import { generateToken } from "../utils/jwt.js";

export async function loginUser(req, res) {
    const { email, password } = req.body
    if (!email || !password) {
        return res.redirect('/login?error=1')
    }

    const user = await User.findOne({email})
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.redirect('/login?error=2')
    }

    const token = generateToken(user)

    res.cookie('currentUser', token, { signed: true, httpOnly: true })
    res.redirect('/current')
}

export async function registerUser(req, res) {
    const { first_name, last_name, email, password } = req.body
    if (!first_name || !last_name || !email || !password) {
        return res.redirect('/register?error=1')
    }

    const hashedPass = bcrypt.hashSync(password, 10)

    const user = await User.findOne({email})
    if (user) {
        return res.redirect('/login?error=2')
    }

    const newUser = await User.create({first_name, last_name, email, password: hashedPass})

    const token = generateToken(newUser)

    res.cookie('currentUser', token, { signed: true, httpOnly: true })
    res.redirect('/current')
}