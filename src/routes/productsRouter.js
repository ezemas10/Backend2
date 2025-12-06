const {Router} = require("express");
// const ProductsManager = require("../dao/productsManager.js");
const { ProductsMongoManager } = require("../dao/productsMongoManager.js");
const { productsModel } = require("../dao/models/productsModel.js");





const productsRouter = Router();
const ProductsManager = ProductsMongoManager;





productsRouter.get("/", async (req, res) => {

  try {
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const sort =
      req.query.sort === "asc" ? { price: 1 } :
      req.query.sort === "desc" ? { price: -1 } : {};

    const q = (req.query.query || req.query.category || "").toString().trim();
    let byStatus, byCategory;
    if (q) {
      const lower = q.toLowerCase();
      if (lower.startsWith("status:")) {
        const val = lower.split(":")[1];
        if (val === "true" || val === "false") byStatus = val === "true";
      } else {
        byCategory = q;
      }
    }

    let total = 0;
    let docs = [];

    if (typeof productsModel?.find === "function" && typeof productsModel?.countDocuments === "function") {
      const filter = {};
      if (byStatus !== undefined) filter.status = byStatus;
      if (byCategory) filter.category = new RegExp("^" + byCategory + "$", "i");

      total = await productsModel.countDocuments(filter);
      docs = await productsModel.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    } 
    
    else {
      
      const all = await ProductsManager.getProducts();
      let list = all;

      if (byStatus !== undefined) list = list.filter(p => Boolean(p.status) === byStatus);
      if (byCategory) {
        const r = new RegExp("^" + byCategory + "$", "i");
        list = list.filter(p => r.test(String(p.category || "")));
      }

      if (sort.price === 1 || sort.price === -1) {
        list = list.slice().sort((a, b) => (a.price - b.price) * sort.price);
      }

      total = list.length;
      docs = list.slice((page - 1) * limit, (page - 1) * limit + limit);
    }

    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    const buildLink = (req, p) => {
      const url = new URL(req.protocol + "://" + req.get("host") + req.originalUrl);
      url.searchParams.set("page", p);
      return url.toString();
    };

    res.status(200).json({
      status: "success",
      payload: docs,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? buildLink(req, prevPage) : null,
      nextLink: hasNextPage ? buildLink(req, nextPage) : null
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      payload: [],
      message: err.message
    });
  }
});


productsRouter.get("/:pid", async (req, res) => {
  const item = await ProductsManager.getProductById(req.params.pid);
  if (!item) return res.status(404).send("Producto no encontrado");
  res.json(item);
});


productsRouter.post("/", async (req, res) => {
  const nuevo = await ProductsManager.createProduct(req.body);
  res.status(201).json(nuevo);
});



productsRouter.put("/:pid", async (req, res) => {
  const actualizado = await ProductsManager.updateProduct(req.params.pid, req.body);
  if (!actualizado) return res.status(404).send("Producto no encontrado");
  res.json(actualizado);
});



productsRouter.delete("/:pid", async (req, res) => {
  const borrado = await ProductsManager.deleteProduct(req.params.pid);
  if (!borrado) return res.status(404).send("Producto no encontrado");
  res.json(borrado);
});


module.exports = productsRouter;
