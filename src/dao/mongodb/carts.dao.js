import cartsModel from "./models/carts.model.js";

export default class CartsDAO {
  getCarts = async () => {
    try {
      return await cartsModel.find().populate("products.product");
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getCartById = async (cid) => {
    try {
      return await cartsModel.findById(cid).populate("products.product");
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  createCart = async () => {
    try {
      return await cartsModel.create({ products: [] });
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  addProductToCart = async (cid, pid) => {
    try {
      const cart = await cartsModel.findById(cid);
      if (!cart) return null;

      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === pid
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      await cart.save();
      return await cartsModel.findById(cid).populate("products.product");
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  deleteProductFromCart = async (cid, pid) => {
    try {
      const cart = await cartsModel.findById(cid);
      if (!cart) return null;

      cart.products = cart.products.filter((p) => p.product.toString() !== pid);

      await cart.save();
      return await cartsModel.findById(cid).populate("products.product");
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  updateCart = async (cid, products) => {
    try {
      const updated = await cartsModel.findByIdAndUpdate(
        cid,
        { $set: { products } },
        { new: true }
      ).populate("products.product");

      return updated;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  updateProductQuantity = async (cid, pid, quantity) => {
    try {
      const cart = await cartsModel.findById(cid);
      if (!cart) return null;

      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === pid
      );

      if (productIndex === -1) return null;

      cart.products[productIndex].quantity = quantity;

      await cart.save();
      return await cartsModel.findById(cid).populate("products.product");
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  deleteAllProducts = async (cid) => {
    try {
      const cart = await cartsModel.findById(cid);
      if (!cart) return null;

      cart.products = [];
      await cart.save();

      return await cartsModel.findById(cid).populate("products.product");
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
