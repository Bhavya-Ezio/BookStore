import * as mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    buyer: {
        type: Boolean,
        default: false,
    },
    seller: {
        type: Boolean,
        default: false,
    },
    bookOwned: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
    verified:{
        type: Boolean,
        default: false,
    }
})

const user = mongoose.model("users", userSchema);
export default user;