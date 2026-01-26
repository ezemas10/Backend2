import { transporter } from "../utils/email.util.js"
import hbs from "nodemailer-express-handlebars"
import path from "path"

const hbsConfig = {

  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve("./src/views"),
    defaultLayout: false,
  },

  viewPath: path.resolve("./src/views"),
  extName: ".handlebars",

}

transporter.use("compile", hbs(hbsConfig))


export const sendWelcomeEmail = async (dest, name) => {

    const emailConfig = {

        from: process.env.EMAIL,
        to: dest,
        subject: "Bienvenido/a",
        template: "email",
        context: {
            text: `Hola ${name}, bienvenido/a`,
        }

    }

    const response = await transporter.sendMail(emailConfig)
    return response

}


export const sendPasswordResetEmail = async (dest, name, link) => {

    const emailConfig = {

        from: process.env.EMAIL,
        to: dest,
        subject: "Recuperar password",
        template: "resetPassword",
        context: {
            name,
            link
        }

    }

    const response = await transporter.sendMail(emailConfig)
    return response

}


export const sendEmailHbs = async (req, res, next) => {

    try {

        const { dest, name } = req.body

        const emailConfig = {

            from: process.env.EMAIL,
            to: dest,
            subject: "Bienvenido/a",
            template: "email",
            context: { text: `Hola ${name}, bienvenido/a`, }

        }

        const response = await transporter.sendMail(emailConfig)
        return res.json(response)

    }

    catch (error) {
        return next(error)
    }

}
