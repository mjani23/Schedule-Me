import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import AvailabilityPopup from './components/AvailabilityPopup';
import { useNavigate } from 'react-router-dom';

const EventPage = () => {
    const { eventId } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userName = searchParams.get('user') || 'unknown';
    const [availabilityList, setAvailabilityList] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    const navigate = useNavigate();
    // Load the availability from Firestore
    const loadAvailability = useCallback(async () => {
        const eventRef = doc(db, 'events', eventId);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
            const data = eventSnap.data();
            const allAvailability = data.availability || {};
            // Get the availability for the current user
            setAvailabilityList(allAvailability[userName] || []);
        } else {
            console.warn('Event does not exist');
        }
    }, [eventId, userName]);

    useEffect(() => {
        loadAvailability();
    }, [loadAvailability]);

    // adding availability
    const handleAddAvailability = () => setShowPopup(true);

    // closing popup and updating the availability
    const handleClosePopup = async (newTimes) => {
        setShowPopup(false);

        if (newTimes.length === 0) return;

        const eventRef = doc(db, 'events', eventId);
        const eventSnap = await getDoc(eventRef);

        // Check if the event exists
        if (eventSnap.exists()) {
            const currentData = eventSnap.data();
            const currentAvailability = currentData.availability || {};
            const existingTimes = currentAvailability[userName] || [];

            const merged = [...existingTimes];
            newTimes.forEach((time) => {
                if (!merged.includes(time)) {
                    merged.push(time);
                }
            });

            // Update the user's availability in the database
            await updateDoc(eventRef, {
                [`availability.${userName}`]: merged
            });

            setAvailabilityList(merged);
        }
    };

    // deleting availability
    const handleDelete = async (entry) => {
        const updated = availabilityList.filter((item) => item !== entry);
        setAvailabilityList(updated);

        const eventRef = doc(db, 'events', eventId);
        await updateDoc(eventRef, {
            [`availability.${userName}`]: updated
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Event: {eventId.replace(/-/g, ' ')}</h2>
            <p>Hi <strong>{userName}</strong>, add your availability below.</p>
            <button onClick={handleAddAvailability}>Add Availability</button>
            <button onClick={() => navigate(`/event/${eventId}/top-times?user=${userName}`)}>View Top Meeting Times</button>


            {showPopup && (
                <AvailabilityPopup
                    onClose={handleClosePopup}
                    existingList={availabilityList}
                />
            )}
            <button
            onClick={() => {
                const base = window.location.origin;
                const shareURL = `${base}/?event=${eventId}`;
                navigator.clipboard.writeText(shareURL);
                alert("Sharable link copied to clipboard!");
            }}
            style={{ marginTop: '10px' }}
            >
            Get Shareable Link
            </button>

            <h3>Your Available Hours:</h3>
            <ul>
                {availabilityList.map((item, index) => (
                    <li key={index}>
                        {item}{" "}
                        <button onClick={() => handleDelete(item)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventPage;

