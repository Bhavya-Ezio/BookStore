import * as mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'books'
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
        },
        count: {
            type: Number,
            default: 0
        }
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    purchasesPerMonth: {
        // Store as an array of objects, each object representing a month
        type: [
            {
                month: Number, // Month number (1-12)
                year: Number,
                count: Number
            }
        ]
    }
});

export default mongoose.model('bookAnalytics', analyticsSchema);