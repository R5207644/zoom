import { User } from "../models/User.model.js";
import httpStatus from "http-status"
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "username and password required field" });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "USER NOT EXISTS" });
        }

        const validation = await bcrypt.compare(password, user.password);
        if (!validation) {
            return res.status(403).json({ message: "wrong username or password" });
        }
        
        const token = crypto.randomBytes(20).toString("hex");

        user.token = token;
        await user.save();
        return res.status(httpStatus.OK).json({ token: token });

    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong ${e.message}` });
    }
}

const register = async (req, res) => {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "name, username and password required field" });
    }

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: "User already exists" });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const user = new User({
            name: name,
            username: username,
            password: hashedPass
        });

        await user.save();
        return res.status(httpStatus.CREATED).json({ message: "User Created Successfully" });

    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong ${e.message}` });
    }
}

export { login, register };