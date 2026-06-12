import {useState,useEffect} from 'react';
import { useNavigate } from 'react-router';
function Submissions(){
    const navigate = useNavigate();
      const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const[SubList,setSubList] = useState([]);

    useEffect(()=>{
        async function fetchSubmissions(){
            try{
            const response = await window.api.getSubmissions();
            console.log('submissions:', response);
            setSubList(response);
        }catch(err){
            setError('Failed to get submissions');
        }finally{
            setLoading(false);
        }
    }
        fetchSubmissions();
    
    },[]);

    if (loading) return <div>Loading submissions...</div>;
if (error) return <div>{error}</div>;
   
    return (
        <div>
            <button onClick={()=>navigate('/')}>Back to Problems</button>
            <ul>
            {SubList.map(sub => (
             <li key={sub.id}>
            <p>Problem : {sub.title}</p>
            <p>Verdict: {sub.verdict}</p>
            <p>Date: {new Date(sub.created_at + 'Z').toLocaleString()}</p>
             </li>
           ))}
            </ul>
        </div>
    )

}


export default Submissions;