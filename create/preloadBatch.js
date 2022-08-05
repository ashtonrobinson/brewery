const { contextBridge, ipcRenderer } = require('electron');

// create a context bridge for sending grain info to main 
contextBridge.exposeInMainWorld('newBatch', {
    // entries is a list of lists (grainType,lbGrain) in form (string,float)
    sendGrainData: (name, entries) => ipcRenderer.send('createBatchEntry', name, entries),
});

