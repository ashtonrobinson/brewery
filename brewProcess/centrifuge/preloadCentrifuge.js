const {contextBridge, ipcRenderer} = require('electron');
const batchID = process.argv[process.argv.length-1];

contextBridge.exposeInMainWorld('centrifuge', {
    getData: () => ipcRenderer.invoke('getCentrifugeData', batchID),
    getBatchName: () => ipcRenderer.invoke('getNameFromID', batchID),
    updateCentrifugeData: (data) => ipcRenderer.send('updateCentrifugeData', batchID, data),
});