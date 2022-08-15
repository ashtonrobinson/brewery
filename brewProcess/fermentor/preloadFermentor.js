const { contextBridge, ipcRenderer } = require('electron');
const batchID = process.argv[process.argv.length-1];

contextBridge.exposeInMainWorld('fermentor', { 
    getBatchName: () => ipcRenderer.invoke('getNameFromID', batchID),
    getFermentorData: () => ipcRenderer.invoke('fermentorData', batchID),
    createDataEntryWindow: () => ipcRenderer.send('createFermentorDataWin', batchID),
    updateDataEntry: (data) => ipcRenderer.send('updateFermentorData', batchID, data),
 });