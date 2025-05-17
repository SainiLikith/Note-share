import {User} from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}   
// Register a new user
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }           
        const newUser = await User.create({
            username,
            email,
            password,
        });
        const token = generateToken(newUser);
        res.status(201).json({
            _id: newUser._id,
            name: newUser.userName,
            email: newUser.email,
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message:"registration stServer error"});
    }
}
// Login a user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }
        console.log(existingUser);
        console.log(password);
        // Check if the password is correct   
        const isMatch = await existingUser.matchPassword(password.trim());
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = generateToken(existingUser);
        res.status(200).json({
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            token,
        });
    }
    catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Server error" });
    }   
}
