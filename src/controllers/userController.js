import User from "../dao/mongodb/models/users.model.js"
import bcrypt from "bcrypt"
import { generateToken } from "../utils/jwt.js"
import { sendWelcomeEmail, sendPasswordResetEmail } from "./email.controller.js"
import crypto from "crypto"

export async function loginUser(req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.redirect("/login?error=1")
  }

  const user = await User.findOne({ email })
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.redirect("/login?error=2")
  }

  const token = generateToken(user)

  res.cookie("currentUser", token, { signed: true, httpOnly: true })
  return res.redirect("/current")
}

export async function registerUser(req, res) {
  const { first_name, last_name, email, password } = req.body
  if (!first_name || !last_name || !email || !password) {
    return res.redirect("/register?error=1")
  }

  const user = await User.findOne({ email })
  if (user) {
    return res.redirect("/login?error=2")
  }

  const hashedPass = bcrypt.hashSync(password, 10)

  const newUser = await User.create({
    first_name,
    last_name,
    email,
    password: hashedPass,
  })

  await sendWelcomeEmail(newUser.email, newUser.first_name)

  const token = generateToken(newUser)

  res.cookie("currentUser", token, { signed: true, httpOnly: true })
  return res.redirect("/current")
}

export function logoutUser(req, res) {
  res.clearCookie("currentUser")
  return res.redirect("/login")
}


export async function forgotPassword(req, res) {

  try {

    const { email } = req.body

    if (!email) {
      return res.status(400).json({ status: "error", message: "Email required" })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ status: "error", message: "Usuario not found" })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")

    const tokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")

    user.resetPasswordToken = tokenHash
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000)

    await user.save()

    const baseUrl = process.env.BASE_URL || "http://localhost:8080"
    const link = `${baseUrl}/api/sessions/reset-password/${resetToken}`

    await sendPasswordResetEmail(user.email, user.first_name, link)

    return res.json({ status: "success", message: "email sent" })

  }

  catch (error) {
    console.log(error)
    return res.status(500).json({ status: "error", message: "Internal Server Error" })
  }

}


export async function resetPassword(req, res) {

  try {

    const { token } = req.params
    const { password } = req.body

    if (!token || !password || password.trim() === "") { return res.status(400).json({ status: "error", message: "token and password required" }) }

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex")

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() }
    })

    if (!user) {
      return res.status(400).json({ status: "error", message: "Invalid or expired token" })
    }


    const isSame = bcrypt.compareSync(password, user.password)
    if (isSame) {
      return res.status(400).json({
        status: "error",
        message: "Password tiene que ser diferente"
      })
    }

    const hashedPass = bcrypt.hashSync(password, 10)

    user.password = hashedPass
    user.resetPasswordToken = null
    user.resetPasswordExpires = null

    await user.save()

    return res.json({ status: "success", message: "Password Actualizado" })

  }

  catch (error) {
    console.log(error)
    return res.status(500).json({ status: "error", message: "Internal Server Error" })
  }

}
