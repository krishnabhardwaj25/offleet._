const fs = require('fs/promises');

const code = `

#include <bits/stdc++.h>
using namespace std;
int square(int n){
    return n*n;
}
int main(){
    int n;
    cin >> n;
    square(n);
    cout << square(n) << endl;
    return 0;
}


`;

async function functional_File() {
    const temp_data = await fs.writeFile('temp.cpp',code);
    console.log('file written successfully');
    const readmyFile  = await fs.readFile('temp.cpp','utf-8');
    
}

functional_File().catch(err => console.error(err));

//learned how to use the 'fs/promises' module to write and read files asynchronously in Node.js.
//creates a file temp.cpp and writes the harcoded code variable into and the reads it.
//can use the unlink method to delete the file after use.