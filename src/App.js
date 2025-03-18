import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./auth/Auth";
import Dashboard from "./auth/Dashboard";
import CreateEvent from "./components/CreateEvent";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
    const [user, setUser] = useState(null);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/auth" element={<Auth onAuthSuccess={() => setUser(auth.currentUser)} />} />
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
                <Route path="/create-event" element={user ? <CreateEvent /> : <Navigate to="/auth" />} />
                <Route path="*" element={<Navigate to="/auth" />} />
            </Routes>
        </Router>
    );
}

export default App;
