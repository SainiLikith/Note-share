import React from "react";
import axios from "../api/axios";
import { useState } from "react";




function ShareModal({noteId, onClose}) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("read");

    const handleShare = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `/api/notes/${noteId}/share`,
        { email, permission },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );
        onClose();
        console.log("Note shared successfully:", res.data);
    }
    catch (error) {
      console.error("Error sharing note:", error);
    }
    }

  return (
    <div className="modal">
      <h2>Share Note</h2>
      <input
        placeholder="User Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <select value={permission} onChange={(e) => setPermission(e.target.value)}>
        <option value="read">Read</option>
        <option value="write">Write</option>
      </select>
      <button onClick={handleShare}>Share</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  )
}

export default ShareModal