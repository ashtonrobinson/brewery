const { contextBridge, ipcRenderer } = require('electron');
const batchID = process.argv[process.argv.length-1]

contextBridge.exposeInMainWorld('mash', { 
    // the batchID is passed from main as last process variable
    getBatchId: () => batchID,
    getMashData: () => ipcRenderer.invoke('mashData', batchID),
    sendMashData: (data) => ipcRenderer.send('setMashData', batchID, data),
});