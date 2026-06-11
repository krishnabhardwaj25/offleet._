const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    ping: () => ipcRenderer.invoke('ping'),
    getAllProblems: () => ipcRenderer.invoke('getAllProblems'),
    getProblemById: (id) => ipcRenderer.invoke('getProblemById', id),
    runCode: (code, testCases) => ipcRenderer.invoke('run-code', code, testCases),
    submitCode : (code,problemId,testCases) => ipcRenderer.invoke('submit-code',code,problemId,testCases),
    getSubmissions : ()=> ipcRenderer.invoke('getSubmissions'),
    startAuth : ()=> ipcRenderer.invoke('start-auth')
});
