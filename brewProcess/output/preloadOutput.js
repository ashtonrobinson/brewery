const {contextBridge, ipcRenderer} = require('electron');
const batchID = process.argv[process.argv.length-1];

contextBridge.exposeInMainWorld('output', {
    getBatchName: () => ipcRenderer.invoke('getNameFromID', batchID),
    getData: () => ipcRenderer.invoke('getOutputData', batchID),
    sendOutputData: (data) => ipcRenderer.send('updateOutputData', batchID, data),
})