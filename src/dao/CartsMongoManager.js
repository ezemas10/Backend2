const { cartsModel } = require("./models/cartsModel.js");


class CartsMongoManager {
  static async getCarts(filtro = {}) {
    return cartsModel.find(filtro).populate("products.product").lean();
  }



  static async getCartById(id) {
    return cartsModel.findById(id).populate("products.product").lean();
  }



  static async createCart(productsArray = []) {
    const nuevo = await cartsModel.create({ products: productsArray });
    return nuevo.toJSON();
  }


  
  static async updateCart(cid, productsArray = []) {
    return cartsModel
      .findByIdAndUpdate(cid, { products: productsArray }, { new: true })
      .populate("products.product").lean();
  }

 

  static async deleteProductFromCart(cid, pid) {
    return cartsModel
      .findByIdAndUpdate(cid, { $pull: { products: { product: pid } } }, { new: true })
      .populate("products.product").lean();
  }



  static async updateProductQuantity(cid, pid, quantity) {

    const cart = await cartsModel.findById(cid);

    if (!cart) return null;

    const item = cart.products.find(p => p.product.toString() === pid);
    
    if (!item) return null;

    item.quantity = quantity;

    await cart.save();

    return await cartsModel.findById(cid).populate("products.product").lean();
  }




  static async deleteAllProducts(cid) {
    return cartsModel
      .findByIdAndUpdate(cid, { products: [] }, { new: true })
      .populate("products.product").lean();
  }



  static async addProductToCart(cid, pid) {
  try {
    const cart = await cartsModel.findById(cid);
    if (!cart) return null;

    const index = cart.products.findIndex(p => p.product?.toString() === pid);

    if (index === -1) {
      cart.products.push({ product: pid, quantity: 1 });
    } else {
      cart.products[index].quantity += 1;
    }

    const updatedCart = await cart.save();
    const populatedCart = await updatedCart.populate("products.product");
    return populatedCart.toJSON();
  } catch (error) {
    console.error("Error en addProductToCart:", error);
    return null;
  }
}


}

module.exports = { CartsMongoManager };
