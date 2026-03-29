const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    saveDB: (payload) => ipcRenderer.invoke('save-db', payload),
    readDB: (password) => ipcRenderer.invoke('read-db', password),
    destroyDB: () => ipcRenderer.invoke('destroy-db'),
    exportFile: (payload) => ipcRenderer.invoke('export-file', payload),
    changeIcon: (dataURL) => ipcRenderer.invoke('change-icon', dataURL),
    pickFile: (options) => ipcRenderer.invoke('pick-file', options),
    previewDoc: (payload) => ipcRenderer.invoke('preview-doc', payload),
    fetchUrl: (url) => ipcRenderer.invoke('fetch-url', url),
    wakeUp: () => ipcRenderer.invoke('wake-up'),
    saveRecovery: (payload) => ipcRenderer.invoke('save-recovery', payload),
    readRecovery: () => ipcRenderer.invoke('read-recovery'),
    attemptRecovery: (payload) => ipcRenderer.invoke('attempt-recovery', payload),
<<<<<<< HEAD
    // Google Drive
    driveConnect: () => ipcRenderer.invoke('drive-connect'),
    driveStatus: () => ipcRenderer.invoke('drive-status'),
    driveDisconnect: () => ipcRenderer.invoke('drive-disconnect'),
    driveUpload: (payload) => ipcRenderer.invoke('drive-upload', payload),
    driveCreateFolder: (payload) => ipcRenderer.invoke('drive-create-folder', payload),
    driveDelete: (payload) => ipcRenderer.invoke('drive-delete', payload),
    // Auth & Recovery
    saveAutologin: (payload) => ipcRenderer.invoke('save-autologin', payload),
    readAutologin: () => ipcRenderer.invoke('read-autologin'),
    sendRecoveryEmail: (payload) => ipcRenderer.invoke('send-recovery-email', payload),
=======
>>>>>>> 48f259ae7b68df077681896294a7c8af8add075e
});
