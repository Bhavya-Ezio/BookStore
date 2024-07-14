import { StatusCodes } from "http-status-codes";
import User from "../Schemas/user.schema.js";

export default async (req, res, next) => {
    let userID = req.user.id;
    let seller = await User.findById(userID);
    if (seller.seller) {
        next();
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "You are not a seller." })
    }
} 