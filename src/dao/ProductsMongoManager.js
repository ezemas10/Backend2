const { productsModel } = require("./models/productsModel.js");

class ProductsMongoManager {
  static async getProducts(filtro = {}, opciones = {}) {
    return productsModel.find(filtro, null, opciones).lean();
  }

  static async getProductById(id) {
    return productsModel.findById(id).lean();
  }

  static async getProductBy(filtro = {}) {
    return productsModel.findOne(filtro).lean();
  }

  static async createProduct(data) {
    const nuevo = await productsModel.create(data);
    return nuevo.toJSON();
  }

  static async updateProduct(id, data) {
    return productsModel.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteProduct(id) {
    return productsModel.findByIdAndDelete(id, { new: true });
  }


   static async paginate(filtro = {}, opciones = {}) {

    return productsModel.paginate(filtro, opciones);

   }


}

module.exports = { ProductsMongoManager };
