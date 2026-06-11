import {useState,useEffect} from 'react';

function Submissions(){
    const[SubList,setSubList] = useState([]);

    useEffect(()=>{
        async function fetchSubmissions(){
            const response = await window.api.getSubmissions();
            console.log('submissions:', response);
            setSubList(response);
        }
        fetchSubmissions();
    
    },[]);
   
    return (
        <div>
            <ul>
            {SubList.map(sub => (
             <li key={sub.id}>
            <p>Problem ID: {sub.problem_id}</p>
            <p>Verdict: {sub.verdict}</p>
            <p>Date: {new Date(sub.created_at + 'Z').toLocaleString()}</p>
             </li>
           ))}
            </ul>
        </div>
    )

}


export default Submissions;