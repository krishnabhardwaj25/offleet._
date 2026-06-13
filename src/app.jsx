import React from 'react';
import {useState,useEffect} from 'react';
import {HashRouter as Router, Route, Routes} from 'react-router';
import ProblemsList from './pages/ProblemList';
import ProblemDetail from './pages/ProblemDetail';
import Submissions from './pages/Submissions';
import Login from './pages/Login';
import { check } from 'drizzle-orm/gel-core';


function App() {
    const [authChecked,setAuthChecked] = useState(false);
    const [LoggedIn , setLoggedIn] = useState(false);
    useEffect(()=>{
        async function checkAuth() {
            const result = await window.api.isLoggedIn();
            setLoggedIn(result);
            setAuthChecked(true);
        }
        checkAuth();
    },[]);

    if(!authChecked) return <div>Loading...</div>
    return (
        
      <Router>
        <Routes>
             <Route path='/' element={LoggedIn? <ProblemsList/> : <Login/>} />
-            <Route path="/problems/:id" element={<ProblemDetail />} />
            <Route path='/submissions' element={<Submissions/>}/>
        </Routes>
        </Router>
    );
    
}

export default App;