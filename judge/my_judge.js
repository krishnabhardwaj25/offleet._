const {spawn} = require('child_process');
const fs = require('fs/promises');
//testcases
const testCases = [
    { input: '6\n', expected: '36\n' },
    { input: '3\n', expected: '9\n' },
    { input: '10\n', expected: '100\n' },
];

// create an async function to return  promises 
async function my_Judge() {
    try{
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
        break;
    } else{
        const expected_Output = testCases[i].expected;
        if(result.trim() === expected_Output.trim()) {
            console.log(`test case ${i + 1}: verdict: AC`);
        } else {
            console.log(`test case ${i + 1}: verdict: WA`);
            break;
        }
    }
    }
} catch(err){
    console.log('verdict:', err);
} finally {
    await fs.unlink('temp.cpp').catch(() => {});
    await fs.unlink('temp.exe').catch(() => {});
}
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

my_Judge().catch(err => console.error(err));