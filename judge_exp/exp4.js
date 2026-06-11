const {spawn} = require('child_process');
const my_Process = spawn('g++',['temp.cpp','-o','temp.exe']);

my_Process.stdout.on('data', (data) => {
    console.log(data.toString());
});

my_Process.stderr.on('data', (data) => {
   console.error(data.toString());
});

my_Process.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    if (code === 0) {
        const run_Process = spawn('temp.exe');


        const set_My_timer = setTimeout(() => {
            console.log('TLE: Program took too long to execute')
            run_Process.kill();
        }, 1000); // Set timeout for 5 seconds

        
        console.log('sending input to the program');
        run_Process.stdin.write('6\n'); 
        run_Process.stdin.end();

        let output = '';
        run_Process.stdout.on('data', (data) => {
            output += data.toString();
        });

        run_Process.stderr.on('data', (data) => {
            console.error(data.toString());
        });

        run_Process.on('close', (code) => {
            if(code==0){
                console.log('Program executed successfully');
                console.log('Output from the program:');
                console.log(output);
            }
            else{
                console.log('program execution failed');
            }
        });
    }
});