import React, { useState } from 'react';

function FRSTViewer() {
  const [header, setHeader] = useState('');
  const [parsedData, setParsedData] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const parsed = parseFRST(content);
        setHeader(parsed.header);
        setParsedData(parsed.sections);
      };
      reader.readAsText(file);
    }
  };

  const parseFRST = (content) => {
    const lines = content.split('\n');
    const headerLines = [];
    //match at least 10, this does not have to be the exact number just more than sub-readers like Edge:
    while (lines.length > 0 && !lines[0].startsWith('==========')) { 
      headerLines.push(lines.shift().trim());
    }
    const header = headerLines.join('\n');
    const sections = lines.join('\n').split(/^={10,}\s+/m);
    const parsedData = {};
    sections.slice(0, -1).forEach(section => { // Ignore the last section
      const sectionLines = section.trim().split('\n').filter(line => line.trim() !== '' && !line.match(/^\((If an|There is no)/));
      if (sectionLines.length > 0) {
        const sectionTitle = sectionLines.shift().trim().replace(/=+/, '').trim();
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
          <h2>Table of Contents</h2>
          <ul>
            {Object.keys(parsedData).map((sectionTitle, index) => (
              <li key={index}>
                <a href={`#section-${index}`}>{sectionTitle}</a>
              </li>
            ))}
          </ul>
          {Object.keys(parsedData).map((sectionTitle, index) => (
            <div key={index} id={`section-${index}`}>
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
    </div>
  );
}

export default FRSTViewer;