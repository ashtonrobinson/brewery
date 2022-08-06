const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('details', {
    // refer to additionalArguments in BrowserWindow
    getBatchNum: () => process.argv[process.argv.length-1],
    getBatchData: () => ipcRenderer.invoke('batchData'),
});