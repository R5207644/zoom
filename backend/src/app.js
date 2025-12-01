import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import mongoose from "mongoose";

import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 8001));
app.use(cors());
app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded({limit: "40kb", extended: true}));

app.use("/api/v1/users", userRoutes);


app.get("/", (req, res) => {
    return res.json({"status": "runing"});
});

let start = async () => {

    let connStr = await mongoose.connect("mongodb+srv://zoom_clone_user:00000000@cluster0.rtaqjep.mongodb.net/videocall");
    console.log(`Connected to ${connStr.connection.host}`);
    server.listen(app.get("port"), () => {
        console.log(`listening on port ${app.get("port")}`);
    })
}

start();