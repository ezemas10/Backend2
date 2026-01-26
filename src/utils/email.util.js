import dotenv from "dotenv"
dotenv.config()

import { createTransport } from "nodemailer"

export const transporter = createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASS,
  },
})
