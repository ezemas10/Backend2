const { connDB } = require("./config/db.js");

const mongoose = require("mongoose");

const express = require("express");

const cartsRouter = require('./routes/cartsRouter.js');
const productsRouter = require("./routes/productsRouter.js")
const viewsRouter =require("./routes/viewsRouter.js")
const { engine } = require("express-handlebars")

const {Server} = require("socket.io")


const PORT = 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded( {extended: true} ) ) ;

app.use(express.static("./src/public"))

app.engine("hbs", engine({extname: ".hbs"}));
app.set("view engine", "hbs")
app.set("views", "./src/views")



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


app.get("/", (req, res) => {
  
    res.status(200).render("index", {
        ok: "ok"

    })
})



const serverHTTP = app.listen(PORT, ()=>{

    console.log(`http://localhost:${PORT} Server running on port ${PORT}`)
})


//const serverSocket = new Server(serverHTTP)


connDB(
    "mongodb+srv://cursobackend1:cursobackend1@cluster0.fpstjym.mongodb.net/?appName=Cluster0",
    "proyectobackend1"
)
