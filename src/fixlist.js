import React from 'react';

// Define an array of custom headers based on section titles
const customHeaders = {
    "Processes": <h4>Procs</h4>,
    "Scheduled Tasks": <h4>Tasks</h4>,
    "Section 3": <h4>Custom Header for Section 3</h4>,
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
                    {customHeaders[sectionTitle] || <h3>{sectionTitle}</h3>}
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