const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('details', {
    // refer to additionalArguments in BrowserWindow
    getBatchNum: () => process.argv[process.argv.length-1],
    getBatchData: () => ipcRenderer.invoke('batchData'),
    getGrainBill: (grainBill) => ipcRenderer.invoke('getGrainData', grainBill),
    createMashWin: (batchID) => ipcRenderer.send('createMashWin', batchID),
    createKettleWin: (batchID) => ipcRenderer.send('createKettleWin', batchID),
    createFermentorWin: (batchID) => ipcRenderer.send('createFermentorWin', batchID),
    createCentrifugeWin: (batchID) => ipcRenderer.send('createCentrifugeWin', batchID),
    createBriteWin: (batchID) => ipcRenderer.send('createBriteWin', batchID),
    createOutputWin: (batchID) => ipcRenderer.send('createOutputWin', batchID),
});