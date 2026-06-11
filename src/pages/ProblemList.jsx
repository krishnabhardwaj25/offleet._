//need to fetch all problems and display them in a list

import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router';


function ProblemsList() {
    const [list, setList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProblems = async () => {
            const response = await window.api.getAllProblems();
            setList(response);
        };

        fetchProblems();
    }, []);

    return (
        <div>
            <button onClick={() => window.api.startAuth()}>Login with Google</button>
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
        </div>
    );
}

export default ProblemsList;