import React, { useState } from 'react';
import JSZip from 'jszip';
import ContentDisplay from './contentDisplay';
import Fixlist from './fixlist';

function FRSTViewer() {
    const [header, setHeader] = useState('');
    const [parsedData, setParsedData] = useState(null);
    const [selectedLines, setSelectedLines] = useState([]);
    const [showSelected, setShowSelected] = useState(false);

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
        // Hacky method of making sections from 19 or more but less than 30 "="
        const sections = lines.join('\n').split(/^={19,29}\s+/m);
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
        const lineData = { fileType, sectionTitle, lineIndex };
        setSelectedLines(prevSelectedLines => {
            if (prevSelectedLines.some(line => line.lineId === lineId)) {
                return prevSelectedLines.filter(line => line.lineId !== lineId);
            } else {
                return [...prevSelectedLines, { lineId, ...lineData }];
            }
        });
    };

    const isSelected = (fileType, sectionTitle, lineIndex) => {
        const lineId = `${fileType}-${sectionTitle}-${lineIndex}`;
        return selectedLines.some(line => line.lineId === lineId);
    };

    const handleViewSelected = () => {
        setShowSelected(true);
    };

    return (
        <div>
            {!showSelected && (
                <>
                    <button style={{ position: 'absolute', top: 10, right: 10 }} onClick={handleViewSelected}>
                        Create Fixlist
                    </button>
                    <input type="file" onChange={handleFileChange} />
                </>
            )}
            <div id="container">
                <h2>FRST Parser</h2>
                <div id="content">
                    {showSelected ? (
                        <Fixlist selectedLines={selectedLines} parsedData={parsedData} />
                    ) : (
                        <ContentDisplay
                            header={header}
                            parsedData={parsedData}
                            isSelected={isSelected}
                            handleLineClick={handleLineClick}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default FRSTViewer;