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
    <div className="container">
        <button className="btn" onClick={() => navigate('/')} style={{ marginBottom: '16px' }}>
            ← Back to Problems
        </button>
        <h1>Submissions</h1>
        <ul className="problem-list">
            {SubList.map(sub => (
                <li key={sub.id} className="problem-item" style={{ cursor: 'default' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{sub.title}</span>
                        <span className={`verdict verdict-${sub.verdict}`}>{sub.verdict}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: '4px 0 0' }}>
                        {new Date(sub.created_at + 'Z').toLocaleString()}
                    </p>
                </li>
            ))}
        </ul>
    </div>
);

}


export default Submissions;