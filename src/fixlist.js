import React from 'react';
import { saveAs } from 'file-saver';

const cannedHeader = `Download the attached **fixlist.txt** file and save it to the Desktop.

**NOTE** It's important that both files, **FRST/FRST64** and **fixlist.txt** are in the same location or the fix will not work.

**NOTICE** This script was written specifically for this user, for use on that particular machine. 
Running this on another machine may cause damage to your operating system**

Run **FRST/FRST64** and press the **Fix** button just once and wait.
If for some reason the tool needs a restart, please make sure you let the system restart normally. 
After that let the tool complete its run.

When finished FRST will generate a log on the Desktop (Fixlog.txt). Please post it to your reply.
`;

const fixlistStart = `Start::
SystemRestore: On
CreateRestorePoint:
CloseProcesses:`

const fixlistEnd = `End::`

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

    const generateFixlistContent = () => {
        let content = `${fixlistStart}`;

        Object.keys(groupedLines).forEach((sectionTitle) => {
            groupedLines[sectionTitle].forEach((line) => {
                content += `${parsedData[line.fileType][sectionTitle][line.lineIndex]}\n`;
            });
        });

        content += `${fixlistEnd}`;
        return content;
    };

    const downloadFixlist = () => {
        const content = generateFixlistContent();
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'fixlist.txt');
    };

    return (
        <div>
            <div class="button-container">
            <div class="button-div">
            <button onClick={downloadFixlist}>Download Fixlist</button>
            </div>
            </div>
            <div className='content'>
                <p>Review your completed fixlist below</p>
                <p>Paste the following message block to the user to explain how to use this Fixlist</p>
            </div>
            <div className="content prewrap">
                {cannedHeader}
            </div>
            <div className="content bulk-content">
                <div className="prewrap">
                    {fixlistStart}
                </div>
                {Object.keys(groupedLines).map((sectionTitle) => (
                    <div className="fl-outer-section" key={sectionTitle}>
                        <div className="fl-inner-section">
                            {groupedLines[sectionTitle].map((line, index) => (
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