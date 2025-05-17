import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function AllNotes() {
  const [notes, setNotes] = useState([]);
  const [sortBy, setSortBy] = useState("updatedAt");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get("/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };
    fetchNotes();
  }, []);
  const sortedNotes = [...notes].sort((a, b) => {
    if (sortBy === "updatedAt") {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    } else if (sortBy === "createdByUser") {
      return (a.createdByUser?.email || "").localeCompare(b.createdByUser?.email || "");
    }
    return 0;
  });

  return (
    <div>
      <h2>All Notes</h2>
      <div>
        <label>Sort By: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="updatedAt">Updated Time</option>
          <option value="createdByUser">User</option>
        </select>
      </div>
      {sortedNotes.map((note) => (
        <div key={note._id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <p>Created by: {note.createdByUser?.email || "You"}</p>
          <p>Last Updated: {new Date(note.updatedAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default AllNotes;
