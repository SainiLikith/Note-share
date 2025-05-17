import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { createNote,shareNote,getAllNotes } from "../controllers/noteController.js";

const router = express.Router();

router.post('/', authMiddleware, createNote);
router.post('/:id/share', authMiddleware, shareNote);
router.get('/', authMiddleware, getAllNotes);

export default router;