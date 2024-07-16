import bcrypt from "bcrypt";
import user from "../Schemas/user.schema.js";
import nm from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import userVerification from '../Schemas/userVerification.schema.js';

const transport = nm.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
})
const sendVerificationEmail = async ({ _id, email }) => {
    const currentURL = "http:localhost:4000/";
    const uniqueString = uuidv4() + _id;
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify Your Email",
        html: `<p>Verify your email address to complete the signup and login into 
        your account .< /p><p>This link <b>expires in 6 hours</b> .
      < /p><p>Press <a href=${currentURL + "verify/" + _id + "/" + uniqueString
            }>here</a> to proceed .< /p>`,
    };

    try {
        const hashedUniqueString = await bcrypt.hash(uniqueString, 10);
        const newUserVerification = new userVerification({
            uid: _id,
            uString: hashedUniqueString,
            createdAt: Date.now(),
        });
        await transport.sendMail(mailOptions);
        await newUserVerification.save();
        return {
            message: "mail sent!!",
            success: true
        };
    } catch (error) {
        return {
            message: error.message,
            success: false
        }
    }
};
export const createUser = async (username, password, type, email) => {
    try {
        let existingUser = await user.findOne({
            $or: [{ email: email },
            { username: username }]
        });
        if (existingUser) {
            return {
                message: "user exists",
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
        let verificationsRes = await sendVerificationEmail(newUser);
        if (verificationsRes.success) {
            newUser = await newUser.save();
            return {
                message: "user created",
                success: true,
            }
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
            if (!u.verified) {
                return {
                    message: "Email not verified",
                    success: false,
                }
            } else {
                return {
                    message: "User found",
                    id: { id: u._id },
                    success: true,
                }
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