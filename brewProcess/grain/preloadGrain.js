const { contextBridge, ipcRenderer } = require('electron');
const batchID = process.argv[process.argv.length-1];

contextBridge.exposeInMainWorld('grain', {
    getGrainBillName: () => ipcRenderer.invoke('getGrainBillName', batchID),
    getGrainBill: () => ipcRenderer.invoke('getGrainData', batchID),
});