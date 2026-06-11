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

// spawns a g++ process to compile the temp.cpp file into temp.exe.
// if it compiles successfully, it then spawns another process to run temp.exe.
// send an input to the program which required an input , captures output and uses stdout to store and print.
// learned how to compile and execute a C++ program from Node.js using child processes, and how to send input.
