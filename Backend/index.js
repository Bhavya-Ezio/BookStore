import express from "express";
import * as mongoose from "mongoose"
import cors from "cors";
import userRoute from "./Routes/user.routes.js";
import verifyRoute from "./Routes/verify.routes.js";
import bookRoute from "./Routes/books.routes.js";

let app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);
app.get("/",(req,res)=>{
    res.send("Welcome to home server");
})
app.use("/user", userRoute)
app.use("/verify", verifyRoute)
app.use("/book", bookRoute)

mongoose.connect(process.env.MONGODB_URI).then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Server is running on port " + process.env.PORT);
    })
}).catch((err) => {
    console.log(err);
})