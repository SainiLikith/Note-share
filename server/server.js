import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import config from './socket/index.js';
import NoteRoutes from './routes/noteRoutes.js';
import AuthRoutes from './routes/authRoutes.js';
dotenv.config();


const app = express();
const server2 = http.createServer(app);
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-app';
const io = new Server(server2, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
config(io);
// Middleware
app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes3
 app.use('/api/notes', NoteRoutes);
 app.use('/api', AuthRoutes);
    

// MongoDB connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));



// server
server2.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})





