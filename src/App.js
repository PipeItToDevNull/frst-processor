import React, { useState } from 'react';

function FRSTViewer() {
  const [parsedData, setParsedData] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const parsed = parseFRST(content);
        setParsedData(parsed);
      };
      reader.readAsText(file);
    }
  };

  const parseFRST = (content) => {
    const sections = content.split(/====================/);
    const parsedData = {};
    sections.forEach(section => {
      const lines = section.trim().split('\n').filter(line => line.trim() !== '' && !line.startsWith('(If an entry is included in the fixlist,'));
      if (lines.length > 0) {
        const sectionTitle = lines.shift().trim().replace(/=+/, '').trim();
        parsedData[sectionTitle] = lines;
      }
    });
    return parsedData;
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {parsedData && (
        <div>
          {Object.keys(parsedData).map((sectionTitle, index) => (
            <div key={index}>
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