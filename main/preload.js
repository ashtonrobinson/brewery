const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dashboard', {
    createBatchWin: () => ipcRenderer.send('createBatchWindow'),
    loadExisting: () => ipcRenderer.invoke('batchData'),
    createDetailsWin: (id) => ipcRenderer.send('createViewWin', id),
});






