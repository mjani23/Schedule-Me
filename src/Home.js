import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Home = () => {
    const [eventName, setEventName] = useState('');
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    //check if event name is given 
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const prefillEvent = queryParams.get('event');
        if (prefillEvent) {
            setEventName(prefillEvent);
        }
    }, [location]);


    //when user clicks continue, check if event name and user name are given
    const handleContinue = async () => {
        const trimmedEvent = eventName.trim().toLowerCase().replace(/\s+/g, '-');
        const trimmedUser = userName.trim();
    
        if (!trimmedEvent || !trimmedUser) {
            alert('Please fill out both fields.');
            return;
        }
    
        // Check if the event already exists
        const eventRef = doc(db, 'events', trimmedEvent);
        const eventSnap = await getDoc(eventRef);
    

        //if does not exist, create a new event
        if (!eventSnap.exists()) {
            await setDoc(eventRef, {
                availability: {
                    [trimmedUser]: []
                },
                creator: trimmedUser
            });
        }
    
        navigate(`/event/${trimmedEvent}?user=${trimmedUser}`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Create or Join an Event</h2>
            <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Event name"
                style={{ marginRight: '10px' }}
            />
            <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name"
                style={{ marginRight: '10px' }}
            />
            <button onClick={handleContinue}>Continue</button>
        </div>
    );
};

export default Home;