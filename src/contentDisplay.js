import React from 'react';

function ContentDisplay({ header, parsedData, isSelected, handleLineClick }) {
    return (
        <div>
            {header && (
                <div>
                    <pre>{header}</pre>
                </div>
            )}
            {parsedData ? (
                <div>
                    <h2>Table of Contents</h2>
                    <ul>
                        {Object.keys(parsedData).map((fileType, index) => (
                            <li key={index}>
                                <strong>{fileType}</strong>
                                <ul>
                                    {Object.keys(parsedData[fileType]).map((sectionTitle, subIndex) => (
                                        <li key={subIndex}>
                                            <a href={`#${fileType.toLowerCase()}-section-${subIndex}`}>{sectionTitle}</a>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                    <div className="bulk-content">
                    {Object.keys(parsedData).map((fileType, index) => (
                        <div key={index}>
                            {Object.keys(parsedData[fileType]).map((sectionTitle, subIndex) => (
                                <div key={subIndex} id={`${fileType.toLowerCase()}-section-${subIndex}`}>
                                    <h2>{sectionTitle}</h2>
                                    <ul>
                                        {parsedData[fileType][sectionTitle].map((line, lineIndex) => (
                                            <li
                                                key={lineIndex}
                                                className={isSelected(fileType, sectionTitle, lineIndex) ? 'selected' : ''}
                                                onClick={() => handleLineClick(fileType, sectionTitle, lineIndex)}
                                            >
                                                {line}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                    </div>
                </div>
            ) : (
                <p>Upload an archive containing FRST.txt and Addition.txt to start.</p>
            )}
        </div>
    );
}

export default ContentDisplay;