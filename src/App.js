import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Viewer from './viewer';
import FixList from './fixlist';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Viewer />} />
                <Route path="/selected" element={<FixList />} />
            </Routes>
        </Router>
    );
}

export default App;