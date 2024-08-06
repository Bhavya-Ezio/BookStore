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

router.post("/addBook", authenticateToken, isSeller, async (req, res) => {
    try {
        const { name, author, pages, price, description, ISBN, publicationDate, lang } = req.body;

        if (!name || typeof name !== 'string') return res.json({ message: 'Invalid book name', success: fasle }).status(StatusCodes.BAD_REQUEST);
        if (!author || typeof author !== 'string') return res.json({ message: 'Invalid book author', success: fasle }).status(StatusCodes.BAD_REQUEST);
        if (!pages || typeof pages !== 'number') return res.json({ message: 'Invalid book pages', success: fasle }).status(StatusCodes.BAD_REQUEST);
        if (!price || typeof price !== 'number') return res.json({ message: 'Invalid book price', success: fasle }).status(StatusCodes.BAD_REQUEST);
        if (!description || typeof description !== 'string') return res.json({ message: 'Invalid book description', success: fasle }).status(StatusCodes.BAD_REQUEST);
        if (!ISBN || typeof ISBN !== 'string') return res.json({ message: 'Invalid book ISBN', success: fasle }).status(StatusCodes.BAD_REQUEST);
        if (!Date || !(publicationDate instanceof Date)) return res.json({ message: 'Invalid book publicationDate', success: fasle }).status(StatusCodes.BAD_REQUEST);
        if (!lang || typeof lang !== 'string') return res.json({ message: 'Invalid book language', success: fasle }).status(StatusCodes.BAD_REQUEST);

        const reply = await createBook(name, author, pages, price, description, ISBN, publicationDate, lang);
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
        })
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
        const bookDetail = await Book.findOne({ _id: bID }, { _id: 0, __v: 0 });
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
        const bRes = await Book.updateOne({
            _id: bID,
        }, {
            $inc: { sold: 1 }
        })

        const uRes = await user.updateOne({
            _id: buyerID
        }, { $push: { bookOwned: bID } })
        if (uRes.modifiedCount && bRes.modifiedCount) {
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
export default router;