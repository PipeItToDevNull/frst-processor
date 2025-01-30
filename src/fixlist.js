import React from 'react';
import { useLocation } from 'react-router-dom';

function SelectedLines() {
    const location = useLocation();
    const { selectedData } = location.state || { selectedData: [] };

    console.log(selectedData); // Add this line to debug

    return (
        <div>
            <h2>Selected Lines</h2>
            <ul>
                {selectedData.map((line, index) => (
                    <li key={index}>{line}</li>
                ))}
            </ul>
        </div>
    );
}

export default SelectedLines;
