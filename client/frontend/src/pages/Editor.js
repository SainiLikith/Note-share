import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../utils/auth.js";


function Editor() {
  const { noteId } = useParams();
  const [note, setNote] = useState({ title: "", content: "", sharedWith: [] });
  const [isShared, setIsShared] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const alertRef = useRef(false);
  const socketRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    const fetchNote = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get(`/api/notes/${noteId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNote(res.data);
        setIsShared(Array.isArray(res.data.sharedWith) && res.data.sharedWith.length > 0);

      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };
    fetchNote();
    socketRef.current.emit("joinNote", noteId);

    const handleUpdate = (updatedNote) => {
      setNote(updatedNote);
      if (!alertRef.current) {
        alert("Note updated by another user");
      } else {
        alertRef.current = true;
      }
    };
    socketRef.current.on("noteUpdated", handleUpdate);
   
    return () => {
        socketRef.current.off("noteUpdated", handleUpdate);
         socketRef.current.disconnect();
      }; 
    },[noteId, navigate]);

  const updateNote = useCallback(
    (field, value) => {
      const updatedNote = { ...note, [field]: value };
      setNote(updatedNote);
      socketRef.current.emit("updateNote", updatedNote);
      axios
        .put(`/api/notes/${noteId}`, updatedNote, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        .then((response) => {
          console.log("Note updated successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error updating note:", error);
        });
    },
    [noteId, note]
  );
  const handleDelete = async () => {
  const confirmed = window.confirm("Are you sure you want to delete this note?");
  if (!confirmed) return;

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to delete a note.");
      return;
    }

    await axios.delete(`/api/notes/${noteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Note deleted successfully.");
    navigate("/all-notes"); // Make sure this matches your actual route
  } catch (error) {
    console.error("Error deleting note:", error);
    alert("Error deleting note.");
  }
};

 const isOwner = getUserIdFromToken() === note.createdByUser?._id;

  return (
     <div style={{ padding: "1rem", maxWidth: "800px", margin: "auto" }}>
      <h2>{note.title || "Untitled Note"}</h2>

      <p><strong>Created by:</strong> {note.createdByUser?.name || "Unknown"}</p>
      <p><strong>Last updated:</strong> {note.updatedAt ? new Date(note.updatedAt).toLocaleString() : "N/A"}</p>
      {isShared && <p style={{ color: "green" }}>Shared Access Enabled</p>}

      <div style={{ marginTop: "1rem" }}>
        {isEditing ? (
          <>
            <input
              value={note.title}
              onChange={(e) => updateNote("title", e.target.value)}
              placeholder="Title"
              style={{ width: "100%", fontSize: "1.2rem", marginBottom: "1rem" }}
            />
            <textarea
              value={note.content}
              onChange={(e) => updateNote("content", e.target.value)}
              placeholder="Start writing..."
              style={{ width: "100%", height: "300px" }}
            />
          </>
        ) : (
          <>
            <h3>Content</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{note.content}</p>
          </>
        )}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => setIsEditing(!isEditing)} style={{ marginRight: "1rem" }}>
          {isEditing ? "Cancel Edit" : "Edit"}
        </button>
        <button onClick={handleDelete} style={{ color: "red" }}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default Editor;
