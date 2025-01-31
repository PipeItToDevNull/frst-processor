import React from 'react';

function Fixlist({ selectedLines, parsedData }) {
    return (
        <div>
            <ul>
                {selectedLines.map((lineId, index) => {
                    const [fileType, sectionTitle, lineIndex] = lineId.split('-');
                    return (
                        <li key={index}>
                            {parsedData[fileType][sectionTitle][lineIndex]}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Fixlist;