import React, { useState } from 'react';
import JSZip from 'jszip';
import { Helmet } from 'react-helmet';
import ContentDisplay from './contentDisplay';
import Fixlist from './fixlist';
import Footer from './footer';

// Retrieve the site name and API URL from environment variables
const SITE_NAME = process.env.REACT_APP_SITE_NAME;

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
        <Helmet>
        <title>{SITE_NAME}</title>
        </Helmet>
        <div id="container">
        <h1>{SITE_NAME}</h1>
        {!showSelected && (
            <>
            <div class="button-container">
            <div class="button-div">
            <input type="file" onChange={handleFileChange} />
            </div>
            <div class="button-div">
            <button onClick={handleViewSelected}>
            Create Fixlist
            </button>
            </div>
            </div>
            </>
        )}
        {showSelected ? (
            <Fixlist selectedLines={selectedLines} parsedData={parsedData} />
        ) : (
            <div class="content">
            <ContentDisplay
            header={header}
            parsedData={parsedData}
            isSelected={isSelected}
            handleLineClick={handleLineClick}
            />
            </div>
        )}
        <Footer />
        </div>
        </div>
    );
}

export default FRSTViewer;