const { contextBridge, ipcRenderer } = require('electron');
const batchID = process.argv[process.argv.length-1];

contextBridge.exposeInMainWorld('fermentorData', {
    addFermentorDataEntry: (data) => ipcRenderer.send('addFermentorData', data, batchID),
    closeWindow: () => ipcRenderer.send('closeEntryWin'),
});