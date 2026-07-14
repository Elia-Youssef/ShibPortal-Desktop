import {app, shell, BrowserWindow} from 'electron'
import {join, resolve} from 'path'
import {electronApp, optimizer, is} from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import BindIPCEvents from "./ShibIPCEvents";
import ShibFileManager from "./ShibFileManager";
import ShibNetworking from "./ShibNetworking";
import jsonConfig from "../../config/config.json"
import ShibAuthentication from "./ShibAuthentication";

let DeepLinkProtocol = jsonConfig.environment == "dev" ? "shibportaldev" : "shibportal";
let mainWindow: BrowserWindow;

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(DeepLinkProtocol, process.execPath, [resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient(DeepLinkProtocol)
}

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (_, commandLine, _workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }

    ShibAuthentication.deeplinkLogin(commandLine.pop() || "")
  })
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 1280,
    minHeight: 720,
    autoHideMenuBar: true,
    icon,
    darkTheme: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
      devTools: jsonConfig.environment == "dev",
    }
  })

  if (jsonConfig.environment == "prod") {
    mainWindow.setMenu(null);
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return {action: 'deny'}
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// dev only
app.commandLine.appendSwitch('ignore-certificate-errors')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.shibhub')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  if (jsonConfig.environment == "dev") {
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })
  }

  BindIPCEvents()

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
app.on('window-all-closed', async() => {
  try {
    // Get the game status using ipcMain
    const result = await ShibFileManager.GetGameStatus();

    if (result.GameStatus == 'Downloading') {
         ShibFileManager.SetGameStatus('Paused');
         ShibNetworking.PauseDownload();
    }
    if (process.platform !== 'darwin') {
      app.quit();
    }
  } catch (error) {
    console.error('Error handling window close:', error);
  }
})
