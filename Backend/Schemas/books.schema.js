import * as mongoose from "mongoose";

const booksSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    pages: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    ISBN: {
        type: String,
        required: true,
    },
    publicationDate: {
        type: Date,
        required: true,
    },
    lang: {
        type: String,
        required: true,
    },
    coverImg: {
        type: String,
    },
    sold: {
        type: Number,
        default: 0,
    },
    supID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users",
    }
})
booksSchema.index({ name: 'text', author: 'text', description: 'text' });
export default mongoose.model("books", booksSchema)