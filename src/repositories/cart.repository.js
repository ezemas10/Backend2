import BaseRepository from "./base-repository.js";
import CartsDAO from "../dao/mongodb/carts.dao.js";

const cartsDao = new CartsDAO();

class CartRepository extends BaseRepository {
  constructor(dao) {
    super(dao);
  }

  getCarts = async () => {
    return await this.dao.getCarts();
  };

  getCartById = async (cid) => {
    return await this.dao.getCartById(cid);
  };

  createCart = async () => {
    return await this.dao.createCart();
  };

  addProductToCart = async (cid, pid) => {
    return await this.dao.addProductToCart(cid, pid);
  };

  deleteProductFromCart = async (cid, pid) => {
    return await this.dao.deleteProductFromCart(cid, pid);
  };

  updateCart = async (cid, products) => {
    return await this.dao.updateCart(cid, products);
  };

   updateCartProducts = async (cid, products) => {
    return await this.dao.updateCart(cid, products)
  };

  updateProductQuantity = async (cid, pid, quantity) => {
    return await this.dao.updateProductQuantity(cid, pid, quantity);
  };

  deleteAllProducts = async (cid) => {
    return await this.dao.deleteAllProducts(cid);
  };

  getAll = async () => {
    return await this.getCarts();
  };

  getById = async (id) => {
    return await this.getCartById(id);
  };

  create = async () => {
    return await this.createCart();
  };
}

export const cartRepository = new CartRepository(cartsDao);
