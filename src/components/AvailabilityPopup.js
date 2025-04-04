import React, { useState } from 'react';

const AvailabilityPopup = ({ onClose, existingList }) => {
    const [startTime, setStartTime] = useState(''); //selected start time
    const [endTime, setEndTime] = useState(''); //selected end time
    const [startPeriod, setStartPeriod] = useState('AM'); //selected start period
    const [endPeriod, setEndPeriod] = useState('AM'); //selected end period
    const [selectedDays, setSelectedDays] = useState([]); //selected days 
    const daysOfWeek = ['M', 'T', 'W', 'Th', 'F', 'S', 'Su'];

    const DayChange = (day) => {
        setSelectedDays((prev) => {
            if (prev.includes(day)) {
                return prev.filter((d) => d !== day);
            } else {
                //spread operator is used to copy the previous state and add the new day
                return [...prev, day];
            }
        });
    };

    // This converts the time to total minutes 
    const parseTime = (timeStr, period) => {
        const trimmed = timeStr.trim();
        const parts = trimmed.split(':');
    
        //check for valid format 
        if (parts.length !== 2) return NaN;
    
        //check for valid time
        let [hourStr, minStr] = parts;
        let hour = parseInt(hourStr, 10);
        const min = parseInt(minStr, 10);
    
        if (isNaN(hour) || isNaN(min)) return NaN;
    
        // Convert to 24-hour format
        if (period === 'PM' && hour !== 12) {
            hour += 12;
        }
        if (period === 'AM' && hour === 12) {
            hour = 0;
        }
    
        return hour * 60 + min;
    };

    // this converts miutes back to time 
    const formatTime = (mins) => {
        const h = Math.floor(mins / 60); //hour
        const m = mins % 60;             

        //put into 12 hour time
        if (m === 0) {
            return `${h}:00`; 
        } else {
            return `${h}:30`; 
        }
    };

    // make list of 30 min time increments (between start and end)
    const generateTimeSlots = (startMin, endMin) => {
        const slots = [];

        for (let current = startMin; current < endMin; current += 30) {
            const next = current + 30; 
            slots.push(`${formatTime(current)} - ${formatTime(next)}`); // Add to list in proper format
        }

        return slots; 
    };

    const Submit = () => {
        const start = parseTime(startTime, startPeriod);
        const end = parseTime(endTime, endPeriod);

    
        if (isNaN(start) || isNaN(end) || start >= end || start % 30 !== 0 || end % 30 !== 0) {
            alert('Time must needs to be in 30-minute increments.');
            return;
        }
    
        const timeSlots = generateTimeSlots(start, end);
        const newList = [];
    
        //check if the time slots are already in the existing list
        selectedDays.forEach((day) => {
            timeSlots.forEach((slot) => {
                const timeEntry = `${day} ${slot}`;
                if (!existingList.includes(timeEntry) && !newList.includes(timeEntry)) {
                    newList.push(timeEntry);
                }
            });
        });
    
        console.log("Generated Availability:", newList);
        onClose(newList);
    };

    return (
        <div className="popup">
            <h3>Add Availability</h3>


            <label>Start Time:</label>
            <label>Start Time (Must be in 30 Minute Increment 11:00):</label>
            <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <button onClick={() => {
                let newPeriod;
                if (startPeriod === 'AM') {
                    newPeriod = 'PM';
                } else {
                    newPeriod = 'AM';
                }
                setStartPeriod(newPeriod);
            }}>
                {startPeriod}
            </button>

            <label>End Time (Must be in 30 Minute Increment eg: 12:30):</label>
            <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            {/* <input type="number" min="1" max="12" value={startTime} onChange={(e) => setStartTime(e.target.value)} /> */}
            <button onClick={() => {
                let newPeriod;
                if (endPeriod === 'AM') {
                    newPeriod = 'PM';
                } else {
                    newPeriod = 'AM';
                }
                setEndPeriod(newPeriod);
            }}>
                {endPeriod}
            </button>

            <div>
            {daysOfWeek.map((day) => (
                <div key={day} style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '30px' }}>{day}</span>
                    <input type="checkbox" onChange={() => DayChange(day)} />
                </div>
            ))}
            </div>

            <button onClick={Submit}>Add Availability</button>
            <button onClick={() => onClose([])}>Close</button>
        </div>
    );
};

export default AvailabilityPopup;
