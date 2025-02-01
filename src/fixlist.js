import React from 'react';

const headMessage = `
Download attached **fixlist.txt** file and save it to the Desktop.

**NOTE** It's important that both files, **FRST/FRST64** and **fixlist.txt** are in the same location or the fix will not work.

**NOTICE** This script was written specifically for this user, for use on that particular machine. 
Running this on another machine may cause damage to your operating system**

Run **FRST/FRST64** and press the **Fix** button just once and wait.
If for some reason the tool needs a restart, please make sure you let the system restart normally. 
After that let the tool complete its run.

When finished FRST will generate a log on the Desktop (Fixlog.txt). Please post it to your reply.
`;

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
            <pre className="head">
                {headMessage}
            </pre>
            {Object.keys(groupedLines).map((sectionTitle) => (
                <div className="fl-outer-section" key={sectionTitle}>
                    {/* <h2>{sectionTitle}</h2> */}
                    <div className="fl-inner-section">
                        {groupedLines[sectionTitle].map((line, index) => (
                            <div className="fl-line" key={index}>
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