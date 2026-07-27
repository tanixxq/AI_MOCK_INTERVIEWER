import mongoose from "mongoose";

 const UserSchema = new mongoose.Schema({
    name: String,
    email : String,
    password : String,
    avatar:String,
    role:String,
    createdAt: Date,
    updatedAt: Date,
})

const User = mongoose.model("User",UserSchema);

export {User,UserSchema};
