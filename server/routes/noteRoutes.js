import express from "express";
import { getNoteById } from "../controllers/noteController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { createNote,shareNote,getAllNotes,getNotesSharedWithOthers,getNotesSharedWithUser,deleteNote} from "../controllers/noteController.js";

const router = express.Router();

router.post('/', authMiddleware, createNote);
router.post('/:id/share', authMiddleware, shareNote);
router.get('/', authMiddleware, getAllNotes);
router.get('/:id', authMiddleware, getNoteById);
router.get('/shared', authMiddleware, getNotesSharedWithOthers);
router.get("/shared-with-me", authMiddleware, getNotesSharedWithUser);
router.delete("/:id", authMiddleware, deleteNote);

export default router;