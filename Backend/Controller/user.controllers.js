import bcrypt from "bcrypt";
import { user } from "../Schemas/user_schema.js";

export const createUser = async (username, password, type, email) => {
    try {
        let existingUser = await user.findOne({ email: email });
        if (existingUser) {
            return {
                message: "Email exists",
                success: false,
            }
        }
        let hash = await bcrypt.hash(password, 10)
        let newUser = new user({
            username: username,
            email: email,
            password: hash,
            buyer: type === "buyer" ? true : false,
            seller: type === "seller" ? true : false,
            bookOwned: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })
        newUser = await newUser.save();
        return {
            message: "user created",
            success: true,
        }
    } catch (error) {
        return {
            message: error.message,
            success: false,
        }
    }
}

export const loginUser = async (username, password) => {
    try {
        let u = await user.findOne({ username: username });
        if (!u) {
            return {
                message: "Username does not exist",
                success: false,
            }
        }
        let response = await bcrypt.compare(password, u.password)
        if (response) {
            return {
                message: "User found",
                success: true,
            }
        }
        return {
            message: "Incorrect password",
            success: false,
        }
    } catch (error) {
        console.log(error);
        return {
            message: error.message,
            success: false,
        }
    }
}