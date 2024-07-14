import { Router, json } from "express";
import Book from "../Schemas/books.schema.js";
import { StatusCodes } from 'http-status-codes';
import authenticateToken from "../Middleware/authenticateToken.js";
import isSeller from "../Middleware/isSeller.js";
import cookieparser from 'cookie-parser';

const router = Router();
router.use(json());
router.use(cookieparser())

router.post("/addBook", authenticateToken, isSeller, async (req, res) => {
    try {
        const { name, author, pages, price, description, ISBN, publicationDate, lang } = req.body;
        const book = new Book({
            name: name,
            author: author,
            pages: pages,
            price: price,
            description: description,
            ISBN: ISBN,
            publicationDate: publicationDate,
            lang: lang,
            supID: req.user.id,
        })
        await book.save();
        return res.json({
            message: "Books added",
            success: true,
        }).status(StatusCodes.OK)
    } catch (error) {
        return res.json({
            message: error.message,
            success: true,
        }).status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
})

router.get("/getBooksAll", authenticateToken, async (req, res) => {
    try {
        const books = await Book.find();
        return res.json({
            message: "Books fetched",
            success: true,
            data: books,
        })
    } catch (error) {
        return res.json({
            message: error.message,
            success: true,
        }).status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
})
export default router;