//need to fetch all problems and display them in a list

import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router';


function ProblemsList() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [list, setList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchProblems = async () => {
            try{
            const response = await window.api.getAllProblems();
            setList(response);
            }catch(err){
                setError('Failed to load problems');
            }
            finally{
                setLoading(false);
            }
        }

        fetchProblems();
    }, []);

if (loading) return <div>Loading...</div>;
if (error) return <div>{error}</div>;
    
       return (
    <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1>Offleet</h1>
            <button className="btn" onClick={() => window.api.logout()}>Logout</button>
        </div>
        <ul className="problem-list">
            {list.map((problem, index) => (
                <li key={problem.id} className="problem-item" onClick={() => navigate(`/problems/${problem.id}`)}>
                    {index + 1}. {problem.title}
                    <span className={`badge badge-${problem.difficulty.toLowerCase()}`} style={{ marginLeft: '12px' }}>
                        {problem.difficulty}
                    </span>
                </li>
            ))}
        </ul>
        <button className="btn btn-primary" onClick={() => navigate('/submissions')} style={{ marginTop: '16px' }}>
            View Submissions
        </button>
    </div>

    );
}

export default ProblemsList;