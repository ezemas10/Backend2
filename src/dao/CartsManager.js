const fs = require("fs")
const {ProductsManager} = require("./ProductsManager")



class CartsManager {

  static #carts = []
  static path = "./src/data/carts.json"

  

  static async getCarts() {
    if (fs.existsSync(this.path)) {
      this.#carts = JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
      return this.#carts
    } 
    else return []
  }



  static async getCartById(cid) {

    let carts = await this.getCarts()

    return carts.find(c => String(c.id) === String(cid)) || null

  }



  static async createCart() {

    await this.getCarts()

    let id = 1

    if (this.#carts.length > 0) {
      id = Math.max(...this.#carts.map(d => Number(d.id))) + 1
    }

    let nuevoCarrito = { id, products: [] }

    this.#carts.push(nuevoCarrito)

    await fs.promises.writeFile(this.path, JSON.stringify(this.#carts, null, 1))

    return nuevoCarrito

  }



  static async addProductToCart(cid, pid, cant = 1) {

    await this.getCarts()

    let cart = this.#carts.find(c => String(c.id) === String(cid))
   
    let product = await ProductsManager.getProductById(pid)
    
    let cantidad = Number(cant)

    if (!Number.isFinite(cantidad) || cantidad <= 0) cantidad = 1

    let pos = cart.products.findIndex(i => String(i.product) === String(pid))

    if (pos === -1) {
      cart.products.push({ product: product.id, quantity: cantidad })
    } 
    
    else cart.products[pos].quantity += cantidad
    
    await fs.promises.writeFile(this.path, JSON.stringify(this.#carts, null, 1))

    return cart

  }
}

module.exports = CartsManager