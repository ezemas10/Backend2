import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const productsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String },
    thumbnails: { type: [String], default: [] }
  },
  {
    timestamps: true,
    strict: true
  }
)

productsSchema.plugin(mongoosePaginate)

export default mongoose.model("products", productsSchema)
