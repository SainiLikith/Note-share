import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router,Route,Routes,Navigate} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/signUp';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import AllNotes from './pages/allNotes';
import SharedNotes from './pages/sharedNote';
import SharedWithMe from './pages/sharedWithMe';
import SharedWithOther from './pages/sharedWithOthers';



function App() {
   
   const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log(token);
    
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);
    
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/dashboard"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
                 />
                  <Route
          path="/editor/:noteId"
          element={isAuthenticated ? <Editor /> : <Navigate to="/login" />}
        />
        <Route path="/all-notes" element={<AllNotes />} />
        <Route path="/shared-notes" element={<SharedNotes />} />
        <Route path="/shared-with-me" element={<SharedWithMe />} />
        <Route path="/shared-with-others" element={<SharedWithOther />} />
        </Routes>
    </Router>
  )
}

export default App