import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("/api/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotes(res.data.ownerNotes || []);
        setSharedNotes(res.data.sharedNotes || []);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, [navigate]);

  const handleCreateNote = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return alert("Not logged in");
    }
    if (!title.trim()) {
      return alert("Please enter a title");
    }

    try {
      const res = await axios.post(
        "/api/notes",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(`/editor/${res.data._id}`);
    } catch (err) {
      console.error("Error creating note:", err.response?.data || err);
      alert("Failed to create note"+ (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h1>My Notes</h1>
      {(notes||[]).map((note) => (
        <div
          key={note._id}
          onClick={() => navigate(`/editor/${note._id}`)}
          style={{ cursor: "pointer", padding: "5px", borderBottom: "1px solid #ccc" }}
        >
          {note.title}
        </div>
      ))}

      <h1>Shared with Me</h1>
      {(sharedNotes||[]).map((note) => (
        <div
          key={note._id}
          onClick={() => navigate(`/editor/${note._id}`)}
          style={{ cursor: "pointer", padding: "5px", borderBottom: "1px solid #ccc" }}
        >
          {note.title}
        </div>
      ))}

      <h2>Create New Note</h2>
       <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "8px" }}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        style={{ display: "block", width: "100%", marginBottom: "8px" }}
      />
      <button onClick={handleCreateNote}>Create Note</button>
      <button onClick={() => navigate("/all-notes")} style={{ marginLeft: "10px" }}>
        View All Notes
      </button>
      <button onClick={() => navigate("/shared-notes")} style={{ marginLeft: "10px" }}>
        View Shared Notes
      </button>
      <button onClick={() => navigate("/shared-with-me")} style={{ marginLeft: "10px" }}>
        View Shared With Me
      </button>
      <button onClick={() => navigate("/shared-with-others")} style={{ marginLeft: "10px" }}>
        View Shared With Others
      </button>
    </div>
  );
}

export default Dashboard;