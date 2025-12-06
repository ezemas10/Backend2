const {Router} = require("express")

// const CartsFSManager = require("../dao/cartsManager.js");

const { CartsMongoManager } = require("../dao/cartsMongoManager.js");


const cartsRouter = Router();
const CartsManager = CartsMongoManager;


cartsRouter.get("/", async (req, res) => {
  const items = await CartsManager.getCarts();
  res.json(items);
});


cartsRouter.get("/:cid", async (req, res) => {
  const cart = await CartsManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).send("Carrito no encontrado");
  res.json(cart);
});


cartsRouter.post("/", async (req, res) => {
  const cart = await CartsManager.createCart(req.body?.products || []);
  res.status(201).json(cart);
});


cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  const out = await CartsManager.deleteProductFromCart(req.params.cid, req.params.pid);
  if (!out) return res.status(404).send("Carrito o producto no encontrado");
  res.json(out);
});


cartsRouter.put("/:cid", async (req, res) => {
  const cid = req.params.cid;
  const products = req.body;
  const updatedCart = await CartsManager.updateCart(cid, products);
  res.json({ status: "success", payload: updatedCart });
});



cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  const qty = Number(req.body?.quantity ?? 1);
  const out = await CartsManager.updateProductQuantity(req.params.cid, req.params.pid, qty);
  if (!out) return res.status(404).send("Carrito o producto no encontrado");
  res.json(out);
});


cartsRouter.delete("/:cid", async (req, res) => {
  const out = await CartsManager.deleteAllProducts(req.params.cid);
  if (!out) return res.status(404).send("Carrito no encontrado");
  res.json(out);
});


cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await CartsManager.addProductToCart(req.params.cid, req.params.pid);

    if (!cart) {
      return res.status(404).json({ message: "Carrito o producto no encontrado" });
    }

    res.status(200).json({
      message: "Producto agregado al carrito correctamente",
      cart
    });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = cartsRouter;
