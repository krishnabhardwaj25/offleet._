import React from 'react';
import {useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router';
import ProblemsList from './pages/ProblemList';
import ProblemDetail from './pages/ProblemDetail';
import Submissions from './pages/Submissions';

function App() {
    return (
        
      <Router>
        <Routes>
            <Route path="/" element={<ProblemsList />} />
            <Route path="/problems/:id" element={<ProblemDetail />} />
            <Route path='/submissions' element={<Submissions/>}/>
        </Routes>
        </Router>
    );
    
}

export default App;