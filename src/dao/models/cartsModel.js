const mongoose = require("mongoose");


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
   
);


const cartsModel = mongoose.model("carts", cartsSchema);


module.exports = { cartsModel };
