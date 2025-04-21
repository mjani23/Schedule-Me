import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const TopTimesPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Get user from URL query string
  const searchParams = new URLSearchParams(window.location.search);
  const userName = searchParams.get('user');

  const [topTimes, setTopTimes] = useState([]);

  // Load all availability data for the event
  useEffect(() => {
    const fetchAvailability = async () => {
      const eventRef = doc(db, 'events', eventId);
      const eventSnap = await getDoc(eventRef);

      if (eventSnap.exists()) {
        const data = eventSnap.data();
        const availability = data.availability || {};

        // Combine all availability times into a single array
        const allTimes = Object.values(availability).flat();

        // Count how many times each time slot was selected
        const counts = {};
        for (const time of allTimes) {
          counts[time] = (counts[time] || 0) + 1;
        }

        // Sort the times by popularity and take the top 3
        const sorted = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3); // maybe change this to 5

        setTopTimes(sorted);
      }
    };

    fetchAvailability();
  }, [eventId]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Top Available Times for: <em>{eventId.replace(/-/g, ' ')}</em></h2>

        {topTimes.length === 0 && (
            <p>No availability data yet.</p>
        )}

        {topTimes.length > 0 && (
        <ol style={{ listStyleType: 'decimal', textAlign: 'left', maxWidth: '300px', margin: '0 auto' }}>
            {topTimes.map(([time, count], index) => {
                //update the label 
                let label = "people";
                if (count === 1) {
                    label = "person";
                }

                // Format the time to be more readable
                return (
                    <li key={index}>
                    {time} — {count} {label}
                    </li>
                );
            })}
        </ol>
        )}



    
        <div style={{ marginTop: '30px' }}>
            <button
                onClick={() => navigate(`/event/${eventId}?user=${userName}`)}
                style={{ marginRight: '10px' }}
                >
                Back to Availability
            </button>

            <button onClick={() => navigate('/')}>
                Go Home
            </button>
        </div>
    </div>
  );
};

export default TopTimesPage;
