import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import AvailabilityPopup from "../components/AvailabilityPopup";

const Availability = () => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false); 
    //useState to manage the availability list so React updates UI
    const [availabilityList, setAvailabilityList] = useState([]);  

    const Logout = async () => {
        try {
            await signOut(auth);
            navigate("/auth");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const goToDashboard = () => {
        navigate("/dashboard");
    };

    const AddAvailability = () => {
        setShowPopup(true);  
    };

    const ClosePopup = (list) => {
        setShowPopup(false);
        if (list && list.length > 0) {
            //merge new list and existing list, used spread operator to not mutate both lists 
            const mergedList = [...availabilityList];
            list.forEach((item) => {
                //check if item already exists in mergedList
                if (!mergedList.includes(item)) {
                    mergedList.push(item);
                }
            });
            setAvailabilityList(mergedList);
        }
    };

    return (
        <div>
            <h2>Availability Page</h2>
            <p>This is where you can add your availability.</p>
            
            <div>
                <button onClick={goToDashboard}>Back to Dashboard</button>
                <button onClick={Logout}>Logout</button>
                <button onClick={AddAvailability}>Add Availability</button>  
            </div>

            {showPopup && (
                <AvailabilityPopup onClose={ClosePopup} existingList={availabilityList} />            
            )}

            <h3>Available Hours:</h3>
            <ul>
                {availabilityList.map((item, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>
                    {item}
                    <button
                        style={{ marginLeft: '10px' }}
                        onClick={() => {
                        const updatedList = availabilityList.filter((_, i) => i !== index);
                        setAvailabilityList(updatedList);
                        }}
                    >
                        Delete
                    </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Availability;