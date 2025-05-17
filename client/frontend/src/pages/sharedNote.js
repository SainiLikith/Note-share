import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function SharedNotes() {
  const [sharedNotes, setSharedNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSharedNotes = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get("/api/notes/shared", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSharedNotes(res.data);
      } catch (err) {
        console.error("Error fetching shared notes:", err);
      }
    };

    fetchSharedNotes();
  }, []);

  const handleDelete = async (noteId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSharedNotes((prev) => prev.filter((note) => note._id !== noteId));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  return (
    <div>
      <h2>Notes You Shared With Others</h2>
      {sharedNotes.length === 0 ? (
        <p>No shared notes found.</p>
      ) : (
        sharedNotes.map((note) => (
          <div key={note._id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <p>
              Shared With:{" "}
              {(note.collaborators || []).map((c, i) => (
                <span key={i}>{c?.userId?.email || "Unknown"} ({c?.permission}){i < note.collaborators.length - 1 ? ', ' : ''}</span>
              ))}
            </p>
            <p>Last Updated: {new Date(note.updatedAt).toLocaleString()}</p>
            <button onClick={() => navigate(`/editor/${note._id}`)}>Edit</button>
            <button onClick={() => handleDelete(note._id)} style={{ marginLeft: "10px", color: "red" }}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default SharedNotes;