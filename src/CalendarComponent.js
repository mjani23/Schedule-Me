import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const CalendarComponent = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState(Views.MONTH); // Track selected view

    return (
        <div style={{ height: 500, margin: "20px" }}>
            <Calendar
                localizer={localizer}
                //No events for now
                events={[]} 
                startAccessor="start"
                endAccessor="end"
                date={currentDate} 
                view={currentView} 

                //next, back, navigation
                onNavigate={(date) => setCurrentDate(date)} 
                //change view
                onView={(view) => setCurrentView(view)} 
                
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]} 
                style={{ height: 500 }}
            />
        </div>
    );
};

export default CalendarComponent;
