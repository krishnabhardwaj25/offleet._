const {spawn}  = require('child_process');
const ls = spawn('cmd', ['/c', 'dir']);

ls.stdout.on('data', (data) => {
    console.log(data.toString());
});

ls.stderr.on('data', (data) => {
   console.error(data.toString());
});

ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});

// This code spawns a child process to execute the 'dir' command in the Windows command prompt.
// It listens for data on the standard output and standard error streams, and logs the output to the console.
// learned how to use the 'spawn' function from the 'child_process' module.