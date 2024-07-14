import * as mongoose from "mongoose";
import { stringify } from "uuid";

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
    }
})

export default mongoose.model("books", booksSchema)