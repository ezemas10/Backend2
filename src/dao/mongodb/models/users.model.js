import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
	age: {type: Number },
    password: {type: String, required: true},
    cart: {type: mongoose.Schema.Types.ObjectId,ref: "carts", default: null},
    role: {type: String,default: "user"},
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  
});

export default mongoose.model('users', userSchema)