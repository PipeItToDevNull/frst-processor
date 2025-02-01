import React from 'react';

// Define an array of custom headers based on section titles
const customHeaders = {
    "Processes": "Procs",
    "Scheduled Tasks": "Tasks",
    "Section 3": "Custom Header for Section 3",
    // Add more custom headers as needed
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
            {Object.keys(groupedLines).map((sectionTitle, index) => (
                <div class="fl-outer-section">
                    <h2>{customHeaders[sectionTitle] || {sectionTitle}}</h2>
                    <div class="fl-inner-section">
                        {groupedLines[sectionTitle].map((line, lineIndex) => (
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