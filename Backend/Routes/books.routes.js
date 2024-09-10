import { Router, json } from "express";
import Book from "../Schemas/books.schema.js";
import { StatusCodes } from 'http-status-codes';
import authenticateToken from "../Middleware/authenticateToken.js";
import isSeller from "../Middleware/isSeller.js";
import isBuyer from "../Middleware/isBuyer.js";
import cookieparser from 'cookie-parser';
import { createBook } from '../Controller/book.controllers.js'
import user from "../Schemas/user.schema.js";
const router = Router();
router.use(json());
router.use(cookieparser())

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

router.post("/addBook", authenticateToken, isSeller, async (req, res) => {
    try {
        const { name, author, pages, price, description, ISBN, publicationDate, lang } = req.body;

        if (!name || typeof name !== 'string') return res.json({ message: 'Invalid book name', success: false }).status(StatusCodes.BAD_REQUEST);
        if (!author || typeof author !== 'string') return res.json({ message: 'Invalid book author', success: false }).status(StatusCodes.BAD_REQUEST);
        if (!pages || typeof pages !== 'number') return res.json({ message: 'Invalid book pages', success: false }).status(StatusCodes.BAD_REQUEST);
        if (!price || typeof price !== 'number') return res.json({ message: 'Invalid book price', success: false }).status(StatusCodes.BAD_REQUEST);
        if (!description || typeof description !== 'string') return res.json({ message: 'Invalid book description', success: false }).status(StatusCodes.BAD_REQUEST);
        if (!ISBN || typeof ISBN !== 'string') return res.json({ message: 'Invalid book ISBN', success: false }).status(StatusCodes.BAD_REQUEST);
        if (!Date || !(publicationDate instanceof Date)) return res.json({ message: 'Invalid book publicationDate', success: false }).status(StatusCodes.BAD_REQUEST);
        if (!lang || typeof lang !== 'string') return res.json({ message: 'Invalid book language', success: false }).status(StatusCodes.BAD_REQUEST);

        const reply = await createBook(name, author, pages, price, description, ISBN, publicationDate, lang);

        const analytics = createAnalytics(reply.bookId);
        return res.json(reply).status(reply.success ? StatusCodes.OK : StatusCodes.INTERNAL_SERVER_ERROR)
    } catch (error) {
        return res.json({
            message: error.message,
            success: true,
        }).status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
})

// router.get("/getBooksAll", authenticateToken, async (req, res) => {
//     try {
//         const books = await Book.find();
//         return res.json({
//             message: "Books fetched",
//             success: true,
//             data: books,
//         })
//     } catch (error) {
//         return res.json({
//             message: error.message,
//             success: true,
//         }).status(StatusCodes.INTERNAL_SERVER_ERROR)
//     }
// })

router.get("/search/:search", authenticateToken, async (req, res) => {
    try {
        const query = req.params.search;
        const regExp = new RegExp(query, 'i');
        const books = await Book.find({
            $or: [
                { name: regExp },
                { author: regExp },
                { description: regExp }
            ]
        }, { _id: 1, name: 1, author: 1 })
        return res.json({
            message: "data sent",
            success: true,
            data: books,
        }).status(StatusCodes.OK);
    } catch (error) {
        return res.json({
            message: error.message,
            success: false,
        }).status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

router.get("/details/:bookID", authenticateToken, async (req, res) => {
    try {
        const bID = req.params.bookID;
        const bookDetail = await Book.findOne({ _id: bID });
        res.json({
            message: "sent", success: true,
            data: bookDetail
        }).status(StatusCodes.OK);
    } catch (error) {
        res.json({
            message: error.message,
            success: false
        }).status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

router.get("/details-sup/:bookID", authenticateToken, async (req, res) => {
    try {
        const bID = req.params.bookID;
        const bookDetail = await Book.findOne({ _id: bID }).populate('supID', { username: 1 });
        res.json({
            message: "sent", success: true,
            data: bookDetail
        }).status(StatusCodes.OK);
    } catch (error) {
        res.json({
            message: error.message,
            success: false
        }).status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

router.post("/buy/:bookID", authenticateToken, isBuyer, async (req, res) => {
    try {
        const bID = req.params.bookID;
        const buyerID = req.user.id;
        let user1 = await user.findOne({ _id: buyerID });
        if (user1.bookOwned.includes(bID)) {
            return res.json({
                message: "User owns the book",
                success: false
            }).status(StatusCodes.BAD_REQUEST);
        }
        const bRes = await Book.updateOne({
            _id: bID,
        }, {
            $inc: { sold: 1 }
        });
        if (bRes.modifiedCount) {
            res.json({
                message: "Successfully bought",
                success: true,
                bookURL: "book PDF URL"
            }).status(StatusCodes.OK);
        } else {
            res.json({
                message: "Error updating DB",
                success: false
            }).status(StatusCodes.INTERNAL_SERVER_ERROR);
        }
    } catch (error) {
        res.json({
            message: error.message,
            success: false
        }).status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

router.post('/create-checkout-session', authenticateToken, isBuyer, async (req, res) => {
    try {
        const { bookId } = req.body;
        const book = await Book.findById(bookId);
        console.log(book);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd', // Replace with your supported currency
                        unit_amount: Math.round(book.price * 100), // Convert price to cents
                        product_data: {
                            name: book.name,
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.SERVER_URL}/success.html`,
            cancel_url: `${process.env.SERVER_URL}/cancel.html`,
        })
        console.log(session.url);
        // res.json({ url: session.url });
        res.json({ message: "done" });
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message,
        })
    }
})
export default router;