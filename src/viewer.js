import React, { useState } from 'react';
import JSZip from 'jszip';
import { useNavigate } from 'react-router-dom';

function FRSTViewer() {
    const [header, setHeader] = useState('');
    const [parsedData, setParsedData] = useState(null);
    const [selectedLines, setSelectedLines] = useState([]);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const zip = await JSZip.loadAsync(e.target.result);
                console.log(zip.files); // Log the contents of the zip file

                const frstFile = zip.file('FRST.txt');
                const additionFile = zip.file('Addition.txt');

                if (frstFile && additionFile) {
                    console.log('FRST and Addition present');
                    const frstContent = await frstFile.async('text');
                    const additionContent = await additionFile.async('text');

                    const parsedFRST = parseFRST(frstContent);
                    const parsedAddition = parseFRST(additionContent);

                    setHeader(parsedFRST.header);
                    setParsedData({
                        FRST: parsedFRST.sections,
                        Addition: parsedAddition.sections
                    });
                } else {
                    console.error('One or both files are missing in the zip');
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const parseFRST = (content) => {
        const lines = content.split('\n');
        const headerLines = [];
        while (lines.length > 0 && !lines[0].startsWith('==========')) {
            headerLines.push(lines.shift().trim());
        }
        const header = headerLines.join('\n');
        const sections = lines.join('\n').split(/^={19,}\s+/m);
        const parsedData = {};
        sections.slice(0, -1).forEach(section => {
            const sectionLines = section.trim().split('\n').filter(line =>
                line.trim() !== '' &&
                !line.match(/^\((If an|There is no)/)
            );
            if (sectionLines.length > 0) {
                let sectionTitle = sectionLines.shift().trim().replace(/=+/, '').trim();
                sectionTitle = sectionTitle.replace(/\s*\(Whitelisted\)\s*/i, '');
                parsedData[sectionTitle] = sectionLines;
            }
        });
        return { header, sections: parsedData };
    };

    const handleLineClick = (fileType, sectionTitle, lineIndex) => {
        const lineId = `${fileType}-${sectionTitle}-${lineIndex}`;
        setSelectedLines(prevSelectedLines => {
            if (prevSelectedLines.includes(lineId)) {
                return prevSelectedLines.filter(id => id !== lineId);
            } else {
                return [...prevSelectedLines, lineId];
            }
        });
    };

    const isSelected = (fileType, sectionTitle, lineIndex) => {
        const lineId = `${fileType}-${sectionTitle}-${lineIndex}`;
        return selectedLines.includes(lineId);
    };

    const handleViewSelected = () => {
        const selectedData = selectedLines.map(lineId => {
            const [fileType, sectionTitle, lineIndex] = lineId.split('-');
            return parsedData[fileType][sectionTitle][lineIndex];
        });
        console.log(selectedData);
        navigate('/fixlist', { state: { selectedData } });
    };

    return (
        <div>
            <button style={{ position: 'absolute', top: 10, right: 10 }} onClick={handleViewSelected}>
                View Selected
            </button>
            <input type="file" onChange={handleFileChange} />
            {header && (
                <div>
                    <h2>Header</h2>
                    <pre>{header}</pre>
                </div>
            )}
            {parsedData && (
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
            )}
        </div>
    );
}

export default FRSTViewer;