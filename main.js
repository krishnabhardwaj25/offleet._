require('dotenv').config({path :'./server/.env'});
const { app, BrowserWindow ,ipcMain} = require('electron/main')
const path = require('path');
const {db,getAllProblems,getProblemById,saveSubmission,getSubmission} = require('./src/main/schema');
const {runJudge} = require('./src/main/judge');
const crypto = require('crypto');
const http = require('http');
const { resolve } = require('dns');
const {net,safeStorage} = require('electron');
const syncService = require('./src/main/sync')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:{
      preload : path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.loadURL('http://localhost:5173');
}

async function syncProblems() {
    const response = await fetch('https://offleet-server.onrender.com/problems');
    const problems = await response.json();
    
    const insertProblem = db.prepare('INSERT OR REPLACE INTO problems (id, title, difficulty, description) VALUES (?, ?, ?, ?)');
    const insertTestCase = db.prepare('INSERT OR REPLACE INTO test_cases (id, problem_id, input, expected_output, is_sample) VALUES (?, ?, ?, ?, ?)');
    
    const syncAll = db.transaction(() => {
        for (const problem of problems) {
            insertProblem.run(problem.id, problem.title, problem.difficulty, problem.description);
            for (const tc of problem.testCases) {
                insertTestCase.run(tc.id, tc.problem_id, tc.input, tc.expected_output, tc.is_sample);
            }
        }
    });
    
    syncAll();
    const count = db.prepare('SELECT COUNT(*) as count FROM problems').get();
    console.log('problems in local DB:', count.count);
    console.log('problems synced');
}

function getTokens() {
  try {
        const row = db.prepare('SELECT tokens FROM users WHERE id = 1').get();
        console.log('row:', row);
        if (!row) return null;
        const decrypted = safeStorage.decryptString(Buffer.from(row.tokens));
        return JSON.parse(decrypted);
    } catch(err) {
        console.error('getTokens error:', err.message);
        return null;
    }
}

function storeTokens(tokens){
  const encrypted = safeStorage.encryptString(JSON.stringify(tokens));
  db.prepare('INSERT OR REPLACE INTO users (id,tokens) VALUES (1,?)').run(encrypted);
}

ipcMain.handle('start-auth',async ()=>{
  await startAuth();
})

async function  exchangeCode(code,code_verifier){
     const response = await fetch('https://offleet-server.onrender.com/auth/google/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, code_verifier })
    });
    const tokens = await response.json();
    return tokens;
}

async function  waitForCode() {
     return new Promise((resolve)=>{
      const server = http.createServer((req,res)=>{
        const url = new URL(req.url,'http://localhost:42813');
        const code = url.searchParams.get('code');
        
        if(code){
          res.writeHead(200,{'Content-Type': 'text/html'});
          res.end('<h1> Login successful! You can close this tab now. </h1>');
          server.close();
          resolve(code);
        }
      })
      server.listen(42813);
     })
}

async function startAuth() {
    const { default: open } = await import('open');
    const{code_verifier,code_challenge} =  generatePKCE();
    const params = new URLSearchParams({
      client_id : process.env.GOOGLE_CLIENT_ID,
      redirect_uri : 'http://localhost:42813',
      response_type : 'code',
      scope : 'openid email profile',
      code_challenge,
      code_challenge_method : 'S256',
    })
    const authURL = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    await open(authURL);
    
    const code = await waitForCode();
     console.log('got code',code);
    const tokens = await exchangeCode(code,code_verifier);
    console.log('got tokens',tokens);
    storeTokens(tokens);
    await syncProblems();
       BrowserWindow.getAllWindows()[0].reload();
}


function generatePKCE(){
    const code_verifier = crypto.randomBytes(64).toString('base64url');
    const code_challenge = crypto.createHash('sha256').update(code_verifier).digest('base64url');
    return {code_verifier,code_challenge};
}

ipcMain.handle('submit-code', async(event,code,problemId,testCases)=>{
       const verdict = await runJudge(code,testCases);
       saveSubmission(problemId,code,verdict);
       return verdict;
});

ipcMain.handle('getSubmissions',()=>{
     return getSubmission();
})

ipcMain.handle('run-code' , async (event, code, testCases)=>{
    const verdict = await runJudge(code, testCases);
    console.log(verdict);
    return verdict;
});


// there will be a ipc handler here which should handle the react request of return problem statement for offleet
ipcMain.handle('getAllProblems',  () => {
      return getAllProblems();
});

ipcMain.handle('getProblemById', (event, id) => {
  return getProblemById(id);
});

ipcMain.handle('ping', async () => {
  return 'pong';
});


app.whenReady().then(async() => {
   const tokens = getTokens();
    if (tokens) {
        console.log('user already logged in');
    } else {
        console.log('user not logged in');
       
    }
    syncService.start();
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('before-quit', () => {
    syncService.stop();
});