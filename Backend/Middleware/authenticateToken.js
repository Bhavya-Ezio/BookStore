import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import User from "../Schemas/user.schema.js";

export default async (req, res, next) => {
    try {
        let token = req.cookies.accessToken;
        if (token == null) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Unauthorized",
                success: false
            });
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "Unauthorized",
                    success: false
                });
            } else {
                let u = await User.findOne({ _id: user.id })
                if (u) {
                    req.user = user;
                    next();
                }
                else {
                    return res.status(StatusCodes.UNAUTHORIZED).json({
                        message: "Unauthorized",
                        success: false
                    });
                }
            }
        });
    } catch (error) {
        // console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            success: false
        });
    }
};
