import { Router } from 'express';
const router = Router();

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import userVerification from '../Schemas/userVerification.schema.js';
import user from '../Schemas/user.schema.js';
import { join } from 'path';
import bcrypt from 'bcrypt';

router.get("/:id/:uString", async (req, res) => {
    const { id, uString } = req.params;
    let message;
    try {
        let result = await userVerification.findOne({ uid: id });
        if (result) {
            let response = await userVerification.findOne({ uid: id }, { uString: 1 })
            if (bcrypt.compare(uString, response.uString)) {
                await userVerification.deleteOne({ uid: id })
                await user.updateOne({ _id: id }, { $set: { verified: true } })
                message = 'The email has been verified'
                return res.redirect(`/verify/verified?message=${message}`)
            }
            else {
                message = 'The link is invalid.It has been altered use the link in the email'
                return res.redirect(`/verify/verified?error=true&&message=${message}`)
            }
        }
        else {
            message = "The email is already verifed or please sign up again"
            return res.redirect(`/verify/verified?error=true&&message=${message}`)
        }
    } catch (error) {
        return res.redirect(`/verify/verified?error=true&&message=${error.message}`)

    }
})

router.get('/verified', (req, res) => {
    let x = join(__dirname, "../verified.html")
    return res.sendFile(x)
})

export default router;