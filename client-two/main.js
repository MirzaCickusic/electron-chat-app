const {app, BrowserWindow, screen, Menu, MenuItem, globalShortcut, ipcMain} = require('electron')
const windowStateKeeper = require('electron-window-state')
const net = require('net');

let mainWindow

let mainMenu = new Menu()

let menuItem1 = new MenuItem({
    label: "Menu",
    submenu: [
        {
            label: "Back",
            click: () => {
                mainWindow.loadFile('src/welcome.html')
            }
        },
        {
            label: "Close",
            click: () => {
                app.quit()
            }
        },
        {
            label: "Refresh",
            click: () => {
                globalShortcut.register("CommandOrControl + R", () => {
                    mainWindow.reload()
                })
            }
        }
    ]
})

mainMenu.append(menuItem1)

function createWindow() {

    const socket = {
        port: 54000,
        readable: true,
        writable: true
    }

    const client = net.createConnection(socket);
    client.on('connect', () => console.log('Connected to server'));

    let windowsState = windowStateKeeper({
        defaultWidth: 800, defaultHeight: 600
    })

    let displays = screen.getAllDisplays()

    let num
    let displayWidth
    let displayHeight

    if (displays.length > 1) {
        num = 0
        displayWidth = displays[num].size.width
        displayHeight = displays[num].size.height
    } else {
        num = 0
        displayWidth = displays[num].size.width / 2
        displayHeight = displays[num].size.height
    }

    mainWindow = new BrowserWindow({
        width: displayWidth, height: displayHeight,
        x: displays[num].bounds.x, y: displays[num].bounds.y,
        webPreferences: {nodeIntegration: true},
        icon: __dirname + '/src/assets/images/icon.ico'
    });

    windowsState.manage(mainWindow)

    mainWindow.loadFile('src/welcome.html')

    Menu.setApplicationMenu(mainMenu)

    client.on('data', (data) => {
        mainWindow.webContents.send('received-message', data.toString())
    })

    ipcMain.on('my-message', (event, message) => {
        client.write(message + "\r\n")
    })

    ipcMain.on('switch-status', (event, data) => {
        if (data) {
            client.connect(socket)
        } else {
            client.destroy()
            console.log("Client disconnected")
        }

    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}


app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (mainWindow === null) createWindow()
})

app.whenReady().then(() => {
    globalShortcut.register("CommandOrControl + R", () => {
        mainWindow.reload()
    })
})