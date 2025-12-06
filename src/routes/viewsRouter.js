const {Router} = require("express")

const { cartsModel } = require("../dao/models/cartsModel");
const { productsModel } = require("../dao/models/productsModel.js");

const ProductsManager = require("../dao/ProductsManager.js");
const CartsManager = require("../dao/CartsManager.js");

const viewsRouter=Router()



viewsRouter.get("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productsModel.findById(pid).lean();
    if (!product) return res.status(404).render("product", { error: "producto no encontrado" });
    res.status(200).render("product", { product });
  } catch (err) {
    res.status(500).render("product", { error: err.message });
  }
});


viewsRouter.get("/products", async (req, res) => {
  try {
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const sort =
      req.query.sort === "asc" ? { price: 1 } :
      req.query.sort === "desc" ? { price: -1 } : {};

    const q = (req.query.query || req.query.category || "").toString().trim();
    const filter = {};
    if (q) {
      const lower = q.toLowerCase();
      if (lower.startsWith("status:")) {
        const v = lower.split(":")[1];
        if (v === "true" || v === "false") filter.status = v === "true";
      } else {
        filter.category = new RegExp("^" + q + "$", "i");
      }
    }

    const total = await productsModel.countDocuments(filter);
    const products = await productsModel
      .find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = totalPages > 0 && page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    const buildLink = (p) => {
      const url = new URL(req.protocol + "://" + req.get("host") + req.originalUrl);
      url.searchParams.set("page", p);
      return url.toString();
    };

    res.status(200).render("index", {
      products,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? buildLink(prevPage) : null,
      nextLink: hasNextPage ? buildLink(nextPage) : null,
      query: req.query.query || "",
      limitParam: limit,
      sortParam: req.query.sort || "",
      sortIsAsc: req.query.sort === "asc",
      sortIsDesc: req.query.sort === "desc"
    });
  } catch (err) {
    res.status(500).render("index", { products: [], error: err.message });
  }
});



viewsRouter.get("/", (req, res) => {
  res.redirect("/products");
});



viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;

    const cart = await cartsModel
      .findById(cid)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.status(404).render("cart", { error: "carrito no encontrado" });
    }

    const items = (cart.products || []).map(it => {
      const p = it.product || {};
      const price = Number(p.price || 0);
      const qty = Number(it.quantity || 0);
      return {
        id: p._id,
        title: p.title,
        category: p.category,
        price,
        quantity: qty,
        subtotal: price * qty
      };
    });

    const total = items.reduce((acc, it) => acc + it.subtotal, 0);

    res.status(200).render("cart", { cartId: cid, items, total });
  } catch (err) {
    res.status(500).render("cart", { error: err.message });
  }
});


// viewsRouter.get("/realtimeproducts", async (req, res) => {

//   try{

//         let listaProductos = await ProductsManager.getProducts();

//         if (!listaProductos || listaProductos.length === 0) {
//         return res.status(404).send("No existen productos");
//         }

//         req.socket.emit("listaProductos", listaProductos)

//         res.status(200).render("realTimeProducts", {
//             contenido: listaProductos, nombrePag: "Productos en Tiempo Real",

//         })
//     }

//     catch(error){

//         console.log(error)

//         res.status(500).send("Internal Server Error");

//     }

//   }
// )


// viewsRouter.get("/carritos/:cid", async (req, res) => {

//   try {
//     let cart = await CartsManager.getCartById(req.params.cid)

//     res.status(200).render("home", {
//             contenido: JSON.stringify(cart.products,null,1), nombrePag: `Carrito Número: ${cart.id}`,

//         })

//   } 

//   catch (error) {

//     console.log(error)

//     res.status(500).send("Internal Server Error")

//   }

// })



// viewsRouter.get("/carritos", async (req, res) => {

//   try{

//         let carts = await CartsManager.getCarts();

//         if (!carts || carts.length === 0) {
//         return res.status(404).send("No existen carritos");
//         }

//         let carritos = JSON.stringify(carts , null, 1)

//         res.status(200).render("home", {
//             contenido: carritos, nombrePag: "Carritos",

//         })
//     }

//     catch(error){

//         console.log(error)

//         res.status(500).send("Internal Server Error");

//     }

//   }
// );



// viewsRouter.get("/productos/:pid", async (req, res) => {

//   try{

//       let pid = req.params.pid;
//       let product = await ProductsManager.getProductById(pid);

//     if (!product) {
//         return res.status(404).send("Producto no encontrado");
//       }

//       let respuesta = JSON.stringify(product, null, 1);
      
//       res.status(200).render("home", {
//             contenido: respuesta, nombrePag: `Producto Número: ${product.id}`,

//         })

//   }

//   catch(error){

//     console.log(error)

//     res.status(500).send("Internal Server Error");

//   }

// });



// viewsRouter.get("/productos", async (req, res) => {

//   try{

//         let products = await ProductsManager.getProducts();

//         if (!products || products.length === 0) {
//         return res.status(404).send("No existen productos");
//         }

//         let productos = JSON.stringify(products, null, 1)

//         res.status(200).render("home", {
//             contenido: productos, nombrePag: "Productos",

//         })
//     }

//     catch(error){

//         console.log(error)

//         res.status(500).send("Internal Server Error");

//     }

//   }
// )


module.exports = viewsRouter
