import { app, shell, BrowserWindow, ipcMain, Tray, Menu } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import fs from 'fs'
const util = require('util')
const exec = util.promisify(require('child_process').exec)

let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 600 * 1.2,
    height: 400 * 1.2,
    show: false,
    resizable: false,
    frame: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    // icon: icon,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js'),
      enableRemoteModule: false,
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  //tray config
  const tray = new Tray(icon)
  let contextMenu = Menu.buildFromTemplate([
    {
      label: 'Restore',
      click: () => {
        mainWindow.show()
        mainWindow.focus()
        // mainWindow.setAlwaysOnTop(true);
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true
        mainWindow.close()
        app.quit()
      }
    }
  ])
  tray.setToolTip('Mognet-Central')
  tray.setContextMenu(contextMenu)
  tray.on('right-click', () => {
    tray.popUpContextMenu()
  })
  tray.on('click', () => {
    mainWindow.show()
    mainWindow.focus()
    // mainWindow.setAlwaysOnTop(true);
    // restore overlay icon when going back from tray
    // setOverlayIcon(currentOverlayIcon);
  })

  // IPC
  async function getDirectories(directory) {
    const entries = await fs.readdirSync(directory, { withFileTypes: true })

    return entries
      .filter((entry) => entry.isDirectory()) // Only keep directories
      .map((entry) => path.join(directory, entry.name))
  }

  ipcMain.on('deploy-start', async (event, data) => {
    const { dir_path, message } = data

    let counter_all = 0
    let counter_success = 0
    let counter_fail = 0
    let counter_moved = 0

    const dirs = await getDirectories(dir_path)

    for (const dir of dirs) {
      counter_all++

      const dir_name = dir.split('\\').pop()

      // Check if initialized for Git
      if (!fs.existsSync(path.join(dir, '.git'))) {
        event.reply('deploy-update', { status: 'Not init', dir: dir_name })
        continue
      }

      try {
        await exec(`cd ${dir} && git add .`)
      } catch (err) {
        event.reply('deploy-update', { status: 'Failed to package', dir: dir_name, err })
        counter_fail++
        continue
      }

      try {
        await exec(`cd ${dir} && git commit -m "${message}"`)
      } catch (err) {
        event.reply('deploy-update', { status: 'Nothing to commit', dir: dir_name, err })
        counter_fail++
        continue
      }

      try {
        await exec(`cd ${dir} && git push`)
      } catch (err) {
        event.reply('deploy-update', { status: 'Missing changes', dir: dir_name, err })
        counter_fail++
        continue
      }

      counter_success++
      event.reply('deploy-update', { status: 'Success', dir: dir_name })
    }

    // Send final update with counters
    event.reply('deploy-done', {
      counter_all,
      counter_success,
      counter_fail,
      counter_moved
    })
  })

  const checkDir = async (data) => {
    return fs.existsSync(data)
  }

  ipcMain.handle('checkDir', async (event, data) => {
    return await checkDir(data).then((result) => {
      return result
    })
  })

  ipcMain.handle('closeApp', async () => {
    mainWindow.close()
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  ipcMain.handle('minimizeApp', async () => {
    mainWindow.minimize();
  })
  //

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
