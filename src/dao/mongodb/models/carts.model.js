import mongoose from "mongoose"

const cartsSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
        quantity: { type: Number, default: 1 }
      }
    ]
  },
  {
    timestamps: true,
    strict: true
  }
)

export default mongoose.model("carts", cartsSchema)
