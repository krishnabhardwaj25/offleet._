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
        <div>
            <button onClick={ () => window.api.logout()}>Logout</button>
            <h1>Problems</h1>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {list.map((problem, index) => (
              <li key={problem.id}>
               <span onClick={() => navigate(`/problems/${problem.id}`)}>
                {index + 1}. {problem.title}
             </span>
           </li>
       ))}
            </ul>
            <button onClick={()=>navigate('/submissions')}>View Submissions</button>
        </div>
    );
}

export default ProblemsList;