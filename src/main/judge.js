const {spawn} = require('child_process');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');
//testcases
async function runJudge(code,testCases) {
      const useDocker = await isDockerAvailable();
      console.log('using docker',useDocker);
      if(useDocker){
        return await runWithDocker(code,testCases);
      }
      else{
        return await runLocally(code,testCases);
      }
}

async function isDockerAvailable() {
    return new Promise((resolve) => {
        const process = spawn('docker', ['info']);
        process.on('close', (code) => {
            resolve(code === 0);
        });
        process.on('error', () => {
            resolve(false);
        });
    });
}

async function compileInDocker(runDir) {
    return new Promise((resolve) => {
        const dockerPath = runDir.replace(/\\/g, '/').replace(/^([A-Za-z]):/, (_, drive) => `/${drive.toLowerCase()}`);
        console.log('compile dockerPath:', dockerPath);
        const dockerProcess = spawn('docker', [
            'run', '--rm', '--network', 'none',
            '--memory', '256m', '--pids-limit', '50',
            '-v', `${dockerPath}:/code`,
            'gcc:latest',
            'sh', '-c', 'g++ -I/usr/local/include/c++/16.1.0/x86_64-linux-gnu /code/temp.cpp -o /code/temp'
        ]);

        let errorOutput = '';
        dockerProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        dockerProcess.on('close', (code) => {
            console.log('compile exit code:', code);
            console.log('compile error:', errorOutput);
            resolve(code === 0);
        });

        dockerProcess.on('error', () => {
            resolve(false);
        });
    });
}

async function runTestCaseInDocker(runDir, input) {
    const processRef = { current: null };
    const timeoutRef = { current: null };

    const result = await Promise.race([
        new Promise((resolve, reject) => {
            const dockerPath = runDir.replace(/\\/g, '/').replace(/^([A-Za-z]):/, (_, drive) => `/${drive.toLowerCase()}`);
             console.log('dockerPath:', dockerPath);
            const dockerProcess = spawn('docker', ['run', '--rm', '--network', 'none','--memory', '256m','--pids-limit', '50', '-v', `${dockerPath}:/code`,'-i', 'gcc:latest','sh',  '-c', ' /code/temp'
            ]);

            processRef.current = dockerProcess;
            console.log('docker process spawned');
            dockerProcess.stdin.write(input);
            dockerProcess.stdin.end();

            let output = '';
            let errorOutput = '';

            dockerProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            dockerProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            dockerProcess.on('close', (code) => {
                  console.log('docker output:', JSON.stringify(output));
                   console.log('docker error:', JSON.stringify(errorOutput));
                if (code === 0) {
                    resolve(output);
                } else {
                    reject(errorOutput || 'RE');
                }
            });

            dockerProcess.on('error', (err) => {
                reject(err.message);
            });

        }),
        my_Timer(timeoutRef)
    ]);

    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
    }

    if (result === 'TLE') {
        if (processRef.current) {
            processRef.current.kill('SIGKILL');
        }

        return 'TLE';
    }

    return result;
}

async function runWithDocker(code,testCases){
      const runDir = await fs.mkdtemp(path.join(os.tmpdir(),'offleet-'));
      console.log(runDir);
      await fs.writeFile(path.join(runDir, 'temp.cpp'), code);
      console.log('code written:', code);
       const compiled = await compileInDocker(runDir);
       console.log('compiled:', compiled); 
       if (!compiled) return 'CE';

      let finalVerdict = '';
      try {
          for (let i = 0; i < testCases.length; i++) {
            const result = await runTestCaseInDocker(runDir, testCases[i].input);
            
            if (result === 'TLE') {
                finalVerdict = 'TLE';
                break;
            } else if (result === 'CE') {
                finalVerdict = 'CE';
                break;
            } else if (result === 'RE') {
                finalVerdict = 'RE';
                break;
            } else if (result.trim() === testCases[i].expected_output.trim()) {
                finalVerdict = 'AC';
            } else {
                finalVerdict = 'WA';
                break;
            }
        }
    } finally {
        await fs.rm(runDir, { recursive: true }).catch(() => {});
    }
    
    return finalVerdict;
}


// create an async function to return  promises 
async function runLocally(code, testCases) {
    let finalVerdict = '';
    try{
        await fs.writeFile('temp.cpp', code);

    await compile();
    for(let i = 0; i < testCases.length ; i++){
        const timeout_Ref = { current: null };
        const processRef = { current: null };
        const result = await Promise.race([run_My_cpp(processRef, testCases[i].input), my_Timer(timeout_Ref)]);
         if(timeout_Ref.current) clearTimeout(timeout_Ref.current);

    if(result === 'TLE') {
        if (processRef.current) {
            processRef.current.kill('SIGKILL');
        }
        console.log(`test case ${i + 1}: verdict: TLE`);
        finalVerdict = 'TLE';
        break;
    } else{
        const expected_Output = testCases[i].expected_output;
        if(result.trim() === expected_Output.trim()) {
            console.log(`test case ${i + 1}: verdict: AC`);
            finalVerdict = 'AC';
        } else {
            console.log(`test case ${i + 1}: verdict: WA`);
            finalVerdict = 'WA';
            break;
        }
    }
    }
} catch(err){
    finalVerdict = err;
    console.log('verdict:', err);
} finally {
    await fs.unlink('temp.cpp').catch(() => {});
    await fs.unlink('temp.exe').catch(() => {});
}
return finalVerdict;
}

async function my_Timer(timeout_Ref){
    return new Promise((resolve, reject) => {
       const id  =  setTimeout(() =>{
            resolve('TLE');
          }, 7000);
          timeout_Ref.current = id;
    });
}

async function compile() {
    return new Promise((resolve, reject) => {
        const my_Process = spawn('g++',['temp.cpp','-o','temp.exe']);
        my_Process.stdout.on('data', (data) => {
             console.log(data.toString());
     });

       my_Process.stderr.on('data', (data) => {
             console.error(data.toString());
       });

       my_Process.on('close', (code) => {
            //await another function 
            if(code === 0){
                resolve();
            } else {
                reject('CE');
            }
       });
    });
}

async function run_My_cpp(processRef, input) {
    return new Promise((resolve, reject) => {
        const run_Process = spawn('temp.exe');
        processRef.current = run_Process; 

        run_Process.stdin.write(input); 
        run_Process.stdin.end();

        let output = '';
        run_Process.stdout.on('data', (data) => {
            output += data.toString();
        });

        run_Process.stderr.on('data', (data) => {
            console.error(data.toString());
        });
        run_Process.on('close', (code) => {
            if(code === 0) {
                resolve(output);
            } else {
                reject('RE');
            }
        });
    });
}

module.exports = {runJudge};