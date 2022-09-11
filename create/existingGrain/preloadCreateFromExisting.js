const { contextBridge, ipcRenderer } = require('electron');

// create a context bridge for sending grain info to main 
contextBridge.exposeInMainWorld('newBatch', {
    getBatchData: () => ipcRenderer.invoke('getGrainBillNames'),
    sendGrainEntry: (name, grainBill) => ipcRenderer.send('createBatchExistingGrain', name, grainBill),
});