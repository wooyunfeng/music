import {app, globalShortcut} from 'electron'
import Tray from './tray'
import initTouchBar from './touch-bar'
import initUpdater from './updater'
import initWindow from './window'
import initIpcEvent from './ipcEvent'
import initMenu from './menu'
import musicApi from './musicApi'
import axios from 'axios'

if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
global.musicApi = musicApi
global.clientApi = axios
global.Tray = Tray

let mainWindow
let backgroundWindow
let touchBar

function createWindow() {
    const windows = initWindow()
    mainWindow = windows.mainWindow
    backgroundWindow = windows.backgroundWindow
    global.mainWindow = windows.mainWindow
    global.backgroundWindow = windows.backgroundWindow
    initMenu()
    // mainWindow.webContents.openDevTools({detach: true})
    mainWindow.on('closed', () => {
        mainWindow = null
    })
    initUpdater()
    touchBar = initTouchBar()
    initIpcEvent(mainWindow, backgroundWindow, touchBar)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('will-quit', () => {
    // 清空所有快捷键
    globalShortcut.unregisterAll()
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    } else {
        mainWindow.show()
    }
})