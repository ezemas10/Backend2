import { cartRepository } from "../repositories/cart.repository.js"
import CustomError from "../utils/custom-error.js"
import { ticketService } from "./ticket.service.js"
import productsModel from "../dao/mongodb/models/products.model.js"
import { v4 as uuidv4 } from "uuid"


class CartService {

  constructor(repository) {
    this.repository = repository
  }


  getCarts = async () => {
    const carts = await this.repository.getCarts()
    if (!carts) throw new CustomError("Error get carritos", 400)
    return carts
  }


  getCartById = async (cid) => {
    const cart = await this.repository.getCartById(cid)
    if (!cart) throw new CustomError("Carrito no encontrado", 404)
    return cart
  }


  createCart = async () => {
    const cart = await this.repository.createCart()
    if (!cart) throw new CustomError("Error crear carrito", 400)
    return cart
  }


  addProductToCart = async (cid, pid) => {
    const cart = await this.repository.addProductToCart(cid, pid)
    if (!cart) throw new CustomError("Error agregar producto al carrito", 400)
    return cart
  }


  deleteProductFromCart = async (cid, pid) => {
    const cart = await this.repository.deleteProductFromCart(cid, pid)
    if (!cart) throw new CustomError("Error borrar producto del carrito", 400)
    return cart
  }


  updateCartProducts = async (cid, products) => {
    const cart = await this.repository.updateCartProducts(cid, products)
    if (!cart) throw new CustomError("Error actualizar producto del carrito", 400)
    return cart
  }


  updateProductQuantity = async (cid, pid, quantity) => {
    const cart = await this.repository.updateProductQuantity(cid, pid, quantity)
    if (!cart) throw new CustomError("Error actualizar cantidad del producto", 400)
    return cart
  }


  deleteAllProducts = async (cid) => {
    const cart = await this.repository.deleteAllProducts(cid)
    if (!cart) throw new CustomError("Error al borrar todos los productos", 400)
    return cart
  }


  purchaseCart = async (cid, purchaserEmail) => {

    const cart = await this.repository.getCartById(cid)
    if (!cart) throw new CustomError("Carrito not found", 404)

    const purchasable = []
    const notPurchasable = []

    for (const item of cart.products) {

      const productId = item?.product?._id || item?.product
      const quantity = item?.quantity || 0

      if (!productId || quantity <= 0) {
        notPurchasable.push(item)
        continue
      }

      const product = await productsModel.findById(productId)

      if (!product) {
        notPurchasable.push(item)
        continue
      }

      if (product.stock >= quantity) {
        purchasable.push({ product, quantity })
      } else {
        notPurchasable.push(item)
      }
    }

    if (purchasable.length === 0) {
      return {
        ticket: null,
        productsNotPurchased: cart.products
      }
    }

    let amount = 0

    for (const p of purchasable) {
      amount += (p.product.price || 0) * p.quantity
    }

    for (const p of purchasable) {

      const updated = await productsModel.updateOne(
        { _id: p.product._id, stock: { $gte: p.quantity } },
        { $inc: { stock: -p.quantity } }
      )

      if (!updated || updated.modifiedCount === 0) {
        notPurchasable.push({ product: p.product._id, quantity: p.quantity })
      }

    }

    if (amount <= 0) {
      return {
        ticket: null,
        productsNotPurchased: cart.products
      }
    }

    const ticket = await ticketService.create({
      code: uuidv4(),
      amount,
      purchaser: purchaserEmail,
      purchase_datetime: new Date()
    })


    await this.repository.deleteAllProducts(cid)

    return {
      ticket,
      productsNotPurchased: notPurchasable
    }
  }
}


export const cartService = new CartService(cartRepository)
