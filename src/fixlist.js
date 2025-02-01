import React from 'react';

// Define an array of section names based on section titles
const sectionss = {
    "Processes": "Procs",
    "Scheduled Tasks": "Tasks",
    "Section 3": "Custom Header for Section 3",
    // Add more as needed
};

function Fixlist({ selectedLines, parsedData }) {
    // Group selected lines by section titles
    const groupedLines = selectedLines.reduce((acc, line) => {
        const { fileType, sectionTitle, lineIndex } = line;
        if (!acc[sectionTitle]) {
            acc[sectionTitle] = [];
        }
        acc[sectionTitle].push({ fileType, lineIndex });
        return acc;
    }, {});
    
    return (
        <div>
        {Object.keys(groupedLines).map((sectionTitle) => (
            <div class="fl-outer-section">
            {/* <h2>{sections[sectionTitle] ?? sectionTitle}</h2> */}
            <div class="fl-inner-section">
            {groupedLines[sectionTitle].map((line) => (
                <div class="fl-line">
                {parsedData[line.fileType][sectionTitle][line.lineIndex]}
                </div>
            ))}
            </div>
            </div>
        ))}
        </div>
    );
}

export default Fixlist;