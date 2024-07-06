import bcrypt from "bcrypt";
import { user } from "../Schemas/user_schema";

export const createUser = (username, password, type, email) => {
    let existingUser = user.findOne({ email: email });
    if (existingUser) {
        return {
            message: "Email exists",
            success: false,
        }
    }
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error while hashing password",
                success: false,
            })
        }
        let newUser = new user({
            email: email,
            password: hash,
            username: username,
            buyer: type === "buyer" ? true : false,
            seller: type === "seller" ? true : false,
            bookOwned: 0,
            created: Date.now(),
            updatedAt: Date.now(),
        })
        if (newUser) {
            return {
                message: "User created",
                success: true,
            }
        }
    })
}

export const loginUser = (username, password) => {
    let u = user.findOne({ username: username });
    if (!u) {
        return {
            message: "Username does not exist",
            success: false,
        }
    }
    bcrypt.compare(password, u.password, (err, result) => {
        if (err) {
            return {
                message: "Error while checking password",
                success: false,
            }
        }
        return {
            message: `${result}`,
            success: true,
        }
    })
}