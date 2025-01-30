import React from 'react';
import { useLocation } from 'react-router-dom';

function SelectedLines() {
    const location = useLocation();
    const { selectedData } = location.state || { selectedData: [] };

    console.log(selectedData); // Add this line to debug

    return (
        <div id="container">
            <h2>Fixlist</h2>
            <div id="content">
                <ul>
                    {selectedData.map((line, index) => (
                        <li key={index}>{line}</li>
                    ))}
                </ul>
</div>
        </div>
    );
}

export default SelectedLines;
