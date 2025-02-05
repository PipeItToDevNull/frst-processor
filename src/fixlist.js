import React from 'react';
import { saveAs } from 'file-saver';

const fixlistStart = `Start::
SystemRestore: On
CreateRestorePoint:
CloseProcesses:
`;

const fixlistEnd = `End::`


// Rename sections for use in cannedHeader only
const sectionTitleMapping = {
    'Internet': 'Network configuration',
    'Registry': 'Registry keys',
    'Security Center': 'Windows Defender configuration',
    'Internet Explorer': 'Internet Explorer configuration'
    // Add more mappings as needed
};

function Fixlist({ selectedLines, parsedData }) {
    // Group selected lines by section titles and count lines
    const groupedLines = selectedLines.reduce((acc, line) => {
        const { fileType, sectionTitle, lineIndex } = line;
        if (!acc[sectionTitle]) {
            acc[sectionTitle] = { lines: [], count: 0 };
        }
        acc[sectionTitle].lines.push({ fileType, lineIndex });
        acc[sectionTitle].count += 1;
        return acc;
    }, {});

    const generateFixlistContent = () => {
        let content = `${fixlistStart}`;

        Object.keys(groupedLines).forEach((sectionTitle) => {
            groupedLines[sectionTitle].lines.forEach((line) => {
                content += `${parsedData[line.fileType][sectionTitle][line.lineIndex]}\n`;
            });
        });

        content += `${fixlistEnd}`;
        return content;
    };

    const generateCannedHeader = () => {
        let preHeader = `**The following issues have been found and will be corrected:**
`;

        Object.keys(groupedLines).forEach((sectionTitle) => {
            const mappedTitle = sectionTitleMapping[sectionTitle] || sectionTitle;
            preHeader += `- ${groupedLines[sectionTitle].count} ${mappedTitle}(s) being killed or removed\n`;
        });

        let postHeader = `
Download the attached **fixlist.txt** file and save it to the Desktop.

**NOTE** It's important that both files, **FRST/FRST64** and **fixlist.txt** are in the same location or the fix will not work.

**NOTICE** This script was written specifically for this user, for use on that particular machine. 
Running this on another machine may cause damage to your operating system**

Run **FRST/FRST64** and press the **Fix** button just once and wait.
If for some reason the tool needs a restart, please make sure you let the system restart normally. 
After that let the tool complete its run.

When finished FRST will generate a log on the Desktop (Fixlog.txt). Please post it to your reply.

**The following changes are being made to your computer:**
`;

        return preHeader + postHeader;
    };

    const downloadFixlist = () => {
        const content = generateFixlistContent();
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'fixlist.txt');
    };

    return (
        <div>
            <div className="button-container">
                <div className="button-div">
                    <button onClick={downloadFixlist}>Download Fixlist</button>
                </div>
            </div>
            <div className="content">
                <p>Review your completed fixlist below</p>
                <p>Paste the following message block to the user to explain how to use this Fixlist</p>
            </div>
            <div className="content prewrap">
                {generateCannedHeader()}
            </div>
            <div className="content bulk-content">
                <div className="prewrap">
                    {fixlistStart}
                </div>
                {Object.keys(groupedLines).map((sectionTitle) => (
                    <div className="fl-outer-section" key={sectionTitle}>
                        <div className="fl-inner-section">
                            {groupedLines[sectionTitle].lines.map((line, index) => (
                                <div className="fl-line" key={index}>
                                    {parsedData[line.fileType][sectionTitle][line.lineIndex]}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <div className="prewrap">
                    {fixlistEnd}
                </div>
            </div>
        </div>
    );
}

export default Fixlist;