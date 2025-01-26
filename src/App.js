import React, { useState } from 'react';
import JSZip from 'jszip';

function App() {
  const [header, setHeader] = useState('');
  const [lines, setLines] = useState([]);
  const [selectedLines, setSelectedLines] = useState([]);

  const handleZipSelect = async (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.zip')) {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);
      const frstFile = zipContent.file("FRST.txt");
      const additionFile = zipContent.file("Addition.txt");

      if (frstFile && additionFile) {
        const frstContent = await frstFile.async("string");
        const additionContent = await additionFile.async("string");
        const combinedLines = frstContent.split('\n').concat(additionContent.split('\n'));
        const { header, processedLines } = processLines(combinedLines);
        setHeader(header);
        setLines(processedLines);
      } else {
        alert("FRST.txt or Addition.txt not found in the ZIP file.");
      }
    } else {
      alert("Please upload a valid ZIP file.");
    }
  };

  const processLines = (lines) => {
    const processedLines = [];
    let currentCategory = '';
    let header = '';
    let isHeader = true;

    lines.forEach(line => {
      if (isHeader) {
        if (line.startsWith('==================== Processes (Whitelisted) =================')) {
          isHeader = false;
        } else {
          header += line + '\n';
        }
      } else {
        if (line.startsWith('====================')) {
          currentCategory = line.replace(/=+/g, '').trim();
          processedLines.push({ category: currentCategory, line: '', isHeader: true });
        } else if (line.trim() !== '' && !line.startsWith('(')) {
          const cleanedLine = line.replace(/\(.*?\)/g, '').trim();
          processedLines.push({ category: currentCategory, line: cleanedLine, isHeader: false });
        }
      }
    });

    return { header, processedLines };
  };

  const handleNext = () => {
    const selected = lines.filter((line, index) => !line.isHeader && document.getElementById(`line-${index}`).checked);
    setSelectedLines(selected);
  };

  return (
    <div className="App">
      <h1>FRST Processor</h1>
      <input type="file" accept=".zip" onChange={handleZipSelect} />
      <div id="headerContent">
        <pre>{header}</pre>
      </div>
      <div id="fileContent">
        {lines.map((line, index) => (
          <div key={index}>
            {line.isHeader ? (
              <h3>{line.category}</h3>
            ) : (
              <>
                <input type="radio" id={`line-${index}`} name="line" value={index} />
                <label htmlFor={`line-${index}`}>{line.line}</label>
              </>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleNext}>Next</button>
      <div id="result">
        <h2>Selected Lines</h2>
        {selectedLines.map((line, index) => (
          <div key={index}>{line.line}</div>
        ))}
      </div>
    </div>
  );
}

export default App;