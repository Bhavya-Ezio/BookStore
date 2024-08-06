import { StatusCodes } from "http-status-codes";
import User from "../Schemas/user.schema.js";

export default async (req, res, next) => {
    let userID = req.user.id;
    let user = await User.findById(userID);
    if (user.buyer) {
        next();
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "You are not a buyer." })
    }
} 