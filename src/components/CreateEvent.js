import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const CreateEvent = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            if (!user) return alert("You must be logged in to create an event.");

            await addDoc(collection(db, "events"), {
                title,
                description,
                createdBy: user.uid,
                invitees: [],
                availability: {}
            });

            alert("Event Created Successfully!");
            setTitle("");
            setDescription("");
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    return (
        <div>
            <h2>Create Event</h2>
            <form onSubmit={handleCreateEvent}>
                <input type="text" placeholder="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <textarea placeholder="Event Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <button type="submit">Create Event</button>
            </form>
        </div>
    );
};

export default CreateEvent;
