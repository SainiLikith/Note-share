import noteModel from "../models/noteModel.js";

//create a new note
export const createNote = async (req, res) => {
  const { title ="Untitled", content = "" } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  try {
    const newNote = await noteModel.create({
      title,
      content,
      createdByUser: req.user._id,
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "note not created" });
  }
};

//share a note
export const shareNote = async (req, res) => {
  const { email, permission } = req.body;
  try {
    const noteToShare = await noteModel.findById(req.params.id);
    if (!noteToShare) {
      return res.status(404).json({ message: "Note not found" });
    }
    const userToShare = await user.findOne({ email });
    if (!userToShare) {
      return res.status(404).json({ message: "User not found" });
    }
    const alreadyCollaborator = noteToShare.collaborators.find((c) =>
      c.userId.equals(userToShare._id)
    );
    if (alreadyCollaborator) {
      alreadyCollaborator.permission = permission;
    } else {
      noteToShare.collaborators.push({ userId: userToShare._id, permission });
    }

    await noteToShare.save();
    res.status(200).json("Note shared successfully");
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// get all notes
export const getAllNotes = async (req, res) => {
  try {
    const notes = await noteModel.find({ createdByUser: req.user._id });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error notes not get" });
  }
};

