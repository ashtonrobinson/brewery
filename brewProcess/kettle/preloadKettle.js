const { contextBridge, ipcRenderer } = require('electron');
const batchID = process.argv[process.argv.length-1]

contextBridge.exposeInMainWorld('kettle', { 
    // the batchID is passed from main as last process variable
    getBatchId: () => batchID,
    getKettleData: () => ipcRenderer.invoke('kettleData', batchID),
    getBatchName: () => ipcRenderer.invoke('getNameFromID', batchID),
    sendKettleData: (data) => ipcRenderer.send('setKettleData', batchID, data),
});