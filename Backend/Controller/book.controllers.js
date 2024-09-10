import Book from '../Schemas/books.schema.js';
import analytics from '../Schemas/analytics.schema.js';

const createBook = async (name, author, pages, price, description, ISBN, publicationDate, lang) => {
    try {
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
        return {
            message: "Book created",
            success:true,
            bookId: book._id,
        }
    } catch (error) {
        return {
            message: "Error creating a book",
            success: false
        }
    }
}

const createAnalytics = (bookId) =>{
    const bookAnalytics = new analytics({
        bookId:bookId,
    }) 
}

export {createBook};