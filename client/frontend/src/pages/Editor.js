import React,{ useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000");



function Editor() {
    const { noteId } = useParams();
    const [note, setNote] = useState({ title: "", content: "", sharedWith: [] });
    const [isShared, setIsShared] = useState(false);
    const alertRef = useRef(false);
    const navigate = useNavigate();
useEffect(() => {
    const fetchNote = async () => {
      const token = localStorage.getItem("token");
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
        setIsShared(res.data.sharedWith.length > 0);
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };
    fetchNote();
     socket.emit("joinNote", noteId);

    
       const handleUpdate = (updatedNote) => {
        setNote(updatedNote);
        if (!alertRef.current) {
            alert("Note updated by another user");
        } else {
            alertRef.current = true;
        }
   
        }
        socket.on("noteUpdated", (handleUpdate) );
        return () => {
            socket.off("noteUpdated", handleUpdate)
        },[noteId, navigate]});


   const updateNote = useCallback((field, value) => {
    const updatedNote = { ...note, [field]: value };
    setNote(updatedNote);
    socket.emit("updateNote", updatedNote);
    axios
      .put(`/api/notes/${noteId}`, updatedNote, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("Note updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating note:", error);
      });
    },[noteId, note, socket]);

  return (
    <div>
      <input
        value={note.title}
        onChange={(e) => updateNote('title', e.target.value)}
      />
      <textarea
        value={note.content}
        onChange={(e) => updateNote('content', e.target.value)}
      />
      {isShared && <div>Shared Access Enabled</div>}
    </div>
  )
}

export default Editor
