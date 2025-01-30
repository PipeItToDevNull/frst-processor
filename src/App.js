import React, { useState } from 'react';
import JSZip from 'jszip';

function FRSTViewer() {
    const [header, setHeader] = useState('');
    const [parsedData, setParsedData] = useState(null);
    const [additionData, setAdditionData] = useState(null);
    
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
                    setParsedData(parsedFRST.sections);
                    setAdditionData(parsedAddition.sections);
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
        const sections = lines.join('\n').split(/^={10,}\s+/m);
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
    
    return (
        <div>
        <input type="file" onChange={handleFileChange} />
        {header && (
            <div>
            <h2>Header</h2>
            <pre>{header}</pre>
            </div>
        )}
        {parsedData && (
            <div>
            <h2>FRST Table of Contents</h2>
            <ul>
            {Object.keys(parsedData).map((sectionTitle, index) => (
                <li key={index}>
                <a href={`#frst-section-${index}`}>{sectionTitle}</a>
                </li>
            ))}
            </ul>
            {Object.keys(parsedData).map((sectionTitle, index) => (
                <div key={index} id={`frst-section-${index}`}>
                <h2>{sectionTitle}</h2>
                <ul>
                {parsedData[sectionTitle].map((line, lineIndex) => (
                    <li key={lineIndex}>{line}</li>
                ))}
                </ul>
                </div>
            ))}
            </div>
        )}
        {additionData && (
            <div>
            <h2>Addition Table of Contents</h2>
            <ul>
            {Object.keys(additionData).map((sectionTitle, index) => (
                <li key={index}>
                <a href={`#addition-section-${index}`}>{sectionTitle}</a>
                </li>
            ))}
            </ul>
            {Object.keys(additionData).map((sectionTitle, index) => (
                <div key={index} id={`addition-section-${index}`}>
                <h2>{sectionTitle}</h2>
                <ul>
                {additionData[sectionTitle].map((line, lineIndex) => (
                    <li key={lineIndex}>{line}</li>
                ))}
                </ul>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}

export default FRSTViewer;