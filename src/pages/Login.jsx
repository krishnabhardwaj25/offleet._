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
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        gap: '24px'
    }}>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '48px', margin: 0 }}>
            Offleet
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
            Practice DSA offline. Sync when you're back online.
        </p>
        <button className="btn btn-primary" onClick={handleLogin} style={{ padding: '12px 24px', fontSize: '16px' }}>
            Continue with Google
        </button>
    </div>
);
}

export default Login;