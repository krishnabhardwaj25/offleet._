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
      console.log(sampleTestCases);
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
    <div>
        <button onClick={()=>navigate('/')}>Back to Problems</button>
      <h1>{problem?.title}</h1>
      <p>{problem?.description}</p>
      <Editor
      height="400px"
      language="cpp"
      theme="vs-dark"
      defaultValue="// write your solution here"
      onChange={(value) => setCode(value||'')}
    />
      <button onClick={runCode} disabled={!problem}>Run Code</button> 
       <button onClick={submitCode}>Submit</button>
    
      {verdict && <p>Verdict: {verdict}</p>}
    </div>
  );
}

export default ProblemDetailPage;