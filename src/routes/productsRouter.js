import { Router } from "express"
import { passportCall } from "../middlewares/passportAuth.js"
import { authorization } from "../middlewares/authorization.js"
import productsModel from "../dao/mongodb/models/products.model.js"

const productsRouter = Router()


productsRouter.get("/", async (req, res) => {

  try {

    const limit = Math.max(parseInt(req.query.limit) || 10, 1)
    const page = Math.max(parseInt(req.query.page) || 1, 1)

    const sort =
      req.query.sort === "asc" ? { price: 1 } :
      req.query.sort === "desc" ? { price: -1 } : {}

    const q = (req.query.query || req.query.category || "").toString().trim()

    let byStatus, byCategory

    if (q) {
      const lower = q.toLowerCase()
      if (lower.startsWith("status:")) {
        const val = lower.split(":")[1]
        if (val === "true" || val === "false") byStatus = val === "true"
      } else {
        byCategory = q
      }
    }

    const filter = {}

    if (byStatus !== undefined) filter.status = byStatus
    if (byCategory) filter.category = new RegExp("^" + byCategory + "$", "i")

    if (typeof productsModel.paginate === "function") {

      const result = await productsModel.paginate(filter, {
        page,
        limit,
        sort,
        lean: true
      })

      const buildLink = (req, p) => {
        const url = new URL(req.protocol + "://" + req.get("host") + req.originalUrl)
        url.searchParams.set("page", p)
        return url.toString()
      }

      return res.status(200).json({
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? buildLink(req, result.prevPage) : null,
        nextLink: result.hasNextPage ? buildLink(req, result.nextPage) : null
      })

    }

    const total = await productsModel.countDocuments(filter)

    const docs = await productsModel.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const totalPages = Math.max(Math.ceil(total / limit), 1)
    const hasPrevPage = page > 1
    const hasNextPage = page < totalPages
    const prevPage = hasPrevPage ? page - 1 : null
    const nextPage = hasNextPage ? page + 1 : null

    const buildLink = (req, p) => {
      const url = new URL(req.protocol + "://" + req.get("host") + req.originalUrl)
      url.searchParams.set("page", p)
      return url.toString()
    }

    return res.status(200).json({
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
    })

  }

  catch (error) {

    console.log(error)

    return res.status(500).json({
      status: "error",
      payload: [],
      message: error.message
    })

  }

})


productsRouter.get("/:pid", async (req, res) => {

  try {

    const item = await productsModel.findById(req.params.pid).lean()

    if (!item) {
      return res.status(404).send("Producto no encontrado")
    }

    return res.json(item)

  }

  catch (error) {

    console.log(error)
    return res.status(500).send("Internal Server Error")

  }

})


productsRouter.post("/", passportCall("jwt"), authorization("admin"), async (req, res) => {

  try {

    const nuevo = await productsModel.create(req.body)
    return res.status(201).json(nuevo)

  }

  catch (error) {

    console.log(error)
    return res.status(500).send("Internal Server Error")

  }

})


productsRouter.put("/:pid", passportCall("jwt"), authorization("admin"), async (req, res) => {

  try {

    const actualizado = await productsModel.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true }
    ).lean()

    if (!actualizado) {
      return res.status(404).send("Producto no encontrado")
    }

    return res.json(actualizado)

  }

  catch (error) {

    console.log(error)
    return res.status(500).send("Internal Server Error")

  }

})


productsRouter.delete("/:pid", passportCall("jwt"), authorization("admin"), async (req, res) => {

  try {

    const borrado = await productsModel.findByIdAndDelete(req.params.pid).lean()

    if (!borrado) {
      return res.status(404).send("Producto no encontrado")
    }

    return res.json(borrado)

  }

  catch (error) {

    console.log(error)
    return res.status(500).send("Internal Server Error")

  }

})


export default productsRouter
