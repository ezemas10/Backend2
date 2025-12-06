const fs = require("fs");


class ProductsManager {

  static #products = [];
  static path = "./src/data/products.json";



  static async getProducts() {

    if (fs.existsSync(this.path)) {
      this.#products = JSON.parse(
        await fs.promises.readFile(this.path, "utf-8")
      );
      return this.#products;
    } 
    else return [];

  }



  static async getProductById(pid) {

    let products = await this.getProducts();
    return products.find(p=>String(p.id) === String(pid));

  }



  static async addProduct(title, description, code, price, status, stock, category, thumbnails) {
    
    await this.getProducts();
    
    let id = 1;

    if (this.#products.length > 0) {
      id = Math.max(...this.#products.map(d=>Number(d.id))) + 1;
    }

    let nuevoProducto = {
      id,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    };

    this.#products.push(nuevoProducto);
    await fs.promises.writeFile(this.path, JSON.stringify(this.#products, null, 1));
    return nuevoProducto;

  }




  static async updateProduct(pid, campos) {

    let products = await this.getProducts();

    let index = products.findIndex(p=>String(p.id) === String(pid));
    if (index === -1) return null;
    
    delete campos.id;
    
    products[index] = { ...products[index], ...campos, id: products[index].id };

    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 1));

    return products[index];

  }



  static async deleteProduct(pid) {

    let products = await this.getProducts();

    let index = products.findIndex(p=>String(p.id) === String(pid));
    if (index === -1) return null; 

    let deleted = products.splice(index, 1)[0];

    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 1));

    return deleted;

  }

}


module.exports = ProductsManager;
