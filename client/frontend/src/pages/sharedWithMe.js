import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function SharedWithMe() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSharedNotes = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get("/api/notes/shared-with-me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data);
      } catch (err) {
        console.error("Error fetching shared-with-me notes:", err);
      }
    };

    fetchSharedNotes();
  }, []);

  return (
    <div>
      <h2>Notes Shared With Me</h2>
      {notes.length === 0 ? (
        <p>No notes shared with you.</p>
      ) : (
        notes.map((note) => (
          <div key={note._id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <p>Shared By: {note.createdByUser?.email || "Unknown"}</p>
            <p>Last Updated: {new Date(note.updatedAt).toLocaleString()}</p>
            <button onClick={() => navigate(`/editor/${note._id}`)}>Open</button>
          </div>
        ))
      )}
    </div>
  );
}

export default SharedWithMe;
