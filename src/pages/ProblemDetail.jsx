import {useState,useEffect} from 'react';
import {useParams,useNavigate} from 'react-router';
import Editor from '@monaco-editor/react';

function ProblemDetailPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// write your solution here');
  const[verdict, setVerdict] = useState(null);
  const navigate = useNavigate();
  const description = problem?.description ? JSON.parse(problem.description) : null;

  useEffect(() => {
    async function loadProblem() {
      try{
      const data = await window.api.getProblemById(Number(id));
      setProblem(data);
    }catch(err){
       setError('Failed to load problems');
    }finally{
      setLoading(false);
    }
  }


    loadProblem();
  }, [id]);

  
     async function runCode() {
      if(!problem) return;
      const sampleTestCases = problem.testCases.filter(tc => tc.is_sample==1);
      
      const result = await window.api.runCode(code, sampleTestCases);
      setVerdict(result);
    }
    async function submitCode(){
      const result = await window.api.submitCode(code,Number(id),problem.testCases);
     setVerdict(result);
    }
    
if (loading) return <div>Loading details...</div>;
if (error) return <div>{error}</div>;

  
   return (
    <div className="container">
        <button className="btn" onClick={() => navigate('/')} style={{ marginBottom: '16px' }}>
            ← Back to Problems
        </button>
        
        <div className="split-pane">
            <div className="split-left">
                <h1>{problem?.title}</h1>
                <span className={`badge badge-${problem?.difficulty.toLowerCase()}`}>
                    {problem?.difficulty}
                </span>
                <p style={{ marginTop: '16px' }}>{description?.statement}</p>
                <p><strong>Input:</strong> {description?.input}</p>
                <p><strong>Output:</strong> {description?.output}</p>
                <p><strong>Constraints:</strong> {description?.constraints}</p>
                <p><strong>Example:</strong></p>
               <pre>Input: {description?.example?.input}
              Output: {description?.example?.output}
              {description?.example?.explanation}</pre>
            </div>
            
            <div className="split-right">
                <Editor
                    height="400px"
                    width= "100%"
                    language="cpp"
                    theme="vs-dark"
                    defaultValue="// write your solution here"
                    onChange={(value) => setCode(value)}
                />
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <button className="btn" onClick={runCode}>Run Code</button>
                    <button className="btn btn-primary" onClick={submitCode}>Submit</button>
                </div>
                {verdict && (
                    <span className={`verdict verdict-${verdict}`}>{verdict}</span>
                )}
            </div>
        </div>
    </div>
);
}

export default ProblemDetailPage;