import { Router } from "express"
import { passportCall } from "../middlewares/passportAuth.js"
import { cartService } from "../services/cart.service.js"
import { authorization } from "../middlewares/authorization.js"


const cartsRouter = Router()

cartsRouter.get("/", passportCall("jwt"), async (req, res) => {
  try {
    const items = await cartService.getCarts()
    return res.json(items)
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
})


cartsRouter.get("/:cid", passportCall("jwt"), async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.cid)
    if (!cart) return res.status(404).send("Carrito no encontrado")
    return res.json(cart)
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
})


cartsRouter.post("/", passportCall("jwt"), async (req, res) => {
  try {
    const cart = await cartService.createCart()
    return res.status(201).json(cart)
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
})



cartsRouter.delete("/:cid/products/:pid", passportCall("jwt"), async (req, res) => {
  try {
    const out = await cartService.deleteProductFromCart(req.params.cid, req.params.pid)
    if (!out) return res.status(404).send("Carrito o producto no encontrado")
    return res.json(out)
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
})


cartsRouter.put("/:cid", passportCall("jwt"), async (req, res) => {
  try {
    const cid = req.params.cid
    const products = req.body
    const updatedCart = await cartService.updateCartProducts(cid, products)
    return res.json({ status: "success", payload: updatedCart })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
})


cartsRouter.put("/:cid/products/:pid", passportCall("jwt"), async (req, res) => {
  try {
    const qty = Number(req.body?.quantity ?? 1)
    const out = await cartService.updateProductQuantity(req.params.cid, req.params.pid, qty)
    if (!out) return res.status(404).send("Carrito o producto no encontrado")
    return res.json(out)
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
})


cartsRouter.delete("/:cid", passportCall("jwt"), async (req, res) => {
  try {
    const out = await cartService.deleteAllProducts(req.params.cid)
    if (!out) return res.status(404).send("Carrito no encontrado")
    return res.json(out)
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
})


cartsRouter.post("/:cid/products/:pid", passportCall("jwt"), authorization("user"), async (req, res) => {

    try {
        const cart = await cartService.addProductToCart(
          req.params.cid,
          req.params.pid
        )

          if (!cart) {
            return res
              .status(404)
              .json({ message: "Carrito o producto no encontrado" })
          }

          return res.status(200).json({
            message: "Producto agregado al carrito correctamente",
            cart,
          })
      } 
      
      catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
      }

    }

)


cartsRouter.post("/:cid/purchase", passportCall("jwt"), authorization("user"), async (req, res) => {

    try {

        const result = await cartService.purchaseCart(
            req.params.cid,
            req.user.email
        )

        return res.status(200).json({
            status: "success",
            ticket: result.ticket,
            productsNotPurchased: result.productsNotPurchased
        })

    }

    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }

})


export default cartsRouter
