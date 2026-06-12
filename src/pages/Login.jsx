import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router';

function Login() {
    const navigate = useNavigate();
    async function handleLogin() {
      await window.api.startAuth();
    //is logged in karke ek function likhna h ipc handle and then expose in preload fir woh bataeyga ki logged in h ke nhi
    //app .jsx mein async function use effect use state ka use karke likhenge checkauth and then render either login or problems
    navigate('/problems');
  }

  return (
    <div>
      <h1>Offleet</h1>
      <button onClick={handleLogin}>
        Continue with Google
      </button>
    </div>
  );
}

export default Login;