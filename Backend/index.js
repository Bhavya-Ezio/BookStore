import express from "express";
import * as mongoose from "mongoose"
import cors from "cors";
import userRoute from "./Routes/user.routes.js";
import verifyRoute from "./Routes/verify.routes.js";
let app = express();

app.use(cors());

app.use("/user", userRoute)
app.use("/verify",verifyRoute)

mongoose.connect(process.env.MONGODB_URI).then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Server is running on port " + process.env.PORT);
    })
}).catch((err) => {
    console.log(err);
})