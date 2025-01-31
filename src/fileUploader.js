import React from 'react';

function FileUploader({ onFileChange }) {
    return (
        <input type="file" onChange={onFileChange} />
    );
}

export default FileUploader;