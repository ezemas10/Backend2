import express from 'express'
import { engine } from 'express-handlebars'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import passport from 'passport'

import usersRouter from './src/routes/usersRouter.js'
import viewsRouter from './src/routes/viewsRouter.js'
import cartsRouter from './src/routes/cartsRouter.js'
import productsRouter from './src/routes/productsRouter.js'

import connectDB from './src/config/db.js'

import initializePassport from './src/config/passport.config.js'

dotenv.config()

const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded( {extended: true} ) ) 
app.use(express.static("./src/public"))

app.engine("hbs", engine({extname: ".hbs"}))
app.set("view engine", "hbs")
app.set("views", "./src/views")

app.use(cookieParser(process.env.JWT_SECRET))

initializePassport()
app.use(passport.initialize())

// app.use( "/", (req, res, next) => {

//     req.socket = serverSocket;
//     next();
//   },

//   viewsRouter

// );

app.use("/", viewsRouter)


// app.use( "/api/products", (req, res, next) => {

//     req.socket = serverSocket;
//     next();

//   },

//   productsRouter

// );



app.use("/api/products", productsRouter)

app.use("/api/carts", cartsRouter)

app.use('/api/users', usersRouter)


app.get("/", (req, res) => {
  
    res.status(200).render("index", {
        ok: "ok"

    })
})



const serverHTTP = app.listen(PORT, ()=>{

    console.log(`http://localhost:${PORT} Server running on port ${PORT}`)
})


//const serverSocket = new Server(serverHTTP)

connectDB()