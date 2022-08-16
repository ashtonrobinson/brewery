const { contextBridge, ipcRenderer } = require("electron");
const batchID = process.argv[process.argv.length-1];

contextBridge.exposeInMainWorld('brite', {
    getBatchName: () => ipcRenderer.invoke('getNameFromID', batchID),
    getData: () => ipcRenderer.invoke('getBriteData', batchID),
    sendBriteData: (data) => ipcRenderer.send('setBriteData', batchID, data),
});


