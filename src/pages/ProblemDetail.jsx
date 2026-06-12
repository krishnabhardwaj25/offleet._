import {useState,useEffect} from 'react';
import {useParams,useNavigate} from 'react-router';
import Editor from '@monaco-editor/react';

function ProblemDetailPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// write your solution here');
  const[verdict, setVerdict] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function loadProblem() {
      const data = await window.api.getProblemById(Number(id));
      setProblem(data);
    }

    loadProblem();
  }, [id]);

  
     async function runCode() {
      const sampleTestCases = problem.testCases.filter(tc => tc.is_sample==1);
      console.log(sampleTestCases);
      const result = await window.api.runCode(code, sampleTestCases);
      setVerdict(result);
    }
    async function submitCode(){
      const result = await window.api.submitCode(code,Number(id),problem.testCases);
     setVerdict(result);
    }

  return (
    <div>
      <h1>{problem?.title}</h1>
      <p>{problem?.description}</p>
      <Editor
      height="400px"
      language="cpp"
      theme="vs-dark"
      defaultValue="// write your solution here"
      onChange={(value) => setCode(value)}
    />
      <button onClick={runCode}>Run Code</button> 
       <button onClick={submitCode}>Submit</button>
       <button onClick={()=>navigate('/submissions')}>View Submissions</button>
      {verdict && <p>Verdict: {verdict}</p>}
    </div>
  );
}

export default ProblemDetailPage;