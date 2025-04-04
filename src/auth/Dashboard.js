import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import CalendarComponent from "/Users/michael/Desktop/my-scheduler-app/src/CalendarComponent.js";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/auth"); 
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    //add a new page avalibity page and button to go there 
    const handleAvailability = async () => {
        navigate("/availability");
    }

    if (!user) {
        return <p>Redirecting to login...</p>;
    }

    return (
        <div>
            <h2>Welcome, {user.email}!</h2>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleAvailability}>Availability</button>
            <h3>Your Calendar</h3>
            <CalendarComponent /> {}
        </div>
    );
};

export default Dashboard;
