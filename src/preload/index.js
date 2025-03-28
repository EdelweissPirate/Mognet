import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  on: (channel, listener) => ipcRenderer.on(channel, listener),
  send: (channel, data) => ipcRenderer.send(channel, data),
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),

  checkDir: (data) => ipcRenderer.invoke('checkDir', data), // One-time check

  deployCargo: (data) => ipcRenderer.send('deploy-start', data),

  onLoopUpdate: (callback) =>
    ipcRenderer.on('deploy-update', (event, message) => callback(message)), // Listen for updates

  onLoopDone: (callback) => ipcRenderer.on('deploy-done', (event, message) => callback(message)), // Listen for completion

  closeApp: () => ipcRenderer.invoke('closeApp') // One-time check
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
