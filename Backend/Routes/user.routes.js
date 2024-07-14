import { Router, json } from "express";
import { StatusCodes } from "http-status-codes";
import { createUser, loginUser } from "../Controller/user.controllers.js";
import jwt from "jsonwebtoken";

const router = Router();
router.use(json());


let validateEmail = (email) => {
    return !RegExp(/^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i).test(email)
}

router.post("/signup", async (req, res) => {
    const { username, password, type, email } = req.body;
    if (!username || typeof (username) !== "string" || !(username.length >= 3 && username.length <= 20)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Invalid Username format!",
            success: false,
        })
    }
    if (!password || typeof (password) !== "string" || !(password.length >= 8 && password.length <= 30)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Invalid Password format!",
            success: false,
        })
    }
    if (!type || (type !== "buyer" && type !== "seller")) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Invalid type!",
            success: false,
        })
    }
    if (!email || validateEmail(email)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Invalid Email Format!",
            success: false,
        })
    }

    let response = await createUser(username, password, type, email);
    return res.json(response).status(response.success ? StatusCodes.OK : StatusCodes.INTERNAL_SERVER_ERROR);
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Username and password are required!",
            success: false,
        }).status(StatusCodes.BAD_REQUEST)
    }
    let response = await loginUser(username, password);
    console.log();
    if (response.success) {
        let accessToken = jwt.sign(response.id, process.env.ACCESS_TOKEN_SECRET);
        return res.cookie("accessToken", accessToken).json({
            message: response.message,
            success: true,
        }).status(StatusCodes.OK);
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json(response)
    }
})

export default router;