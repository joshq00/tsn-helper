// import { app, BrowserWindow } from 'electron'
const { app, BrowserWindow } = require('electron')
const { BrowserView } = require('electron')
const { session } = require('electron')

const path = require('path')
const login = async () => {
  const prom = new Promise((resolve) => {
  const win = new BrowserWindow({
    width: 600,
    height: 500,
    // show: false,
    webPreferences: {
      nodeIntegration: false,
    },
  })

  win.webContents.on( 'will-redirect', (e, url) => {
    console.log(url)
    if (url.startsWith('https://theshownation.com/dashboard')) {
      console.log('will-redir preventing', e)
      resolve()
      // return
      e.preventDefault()
      win.close()
    }
  })
    // win.loadURL('https://ca.account.sony.com/api/v1/oauth/authorize?service_entity=urn:service-entity:psn&response_type=code&client_id=d5e83b44-9f4f-45be-8479-451134e3c9b0&redirect_uri=https://theshownation.com/sessions/oauth&scope=psn:s2s')
    // win.loadURL('https://theshownation.com/mlb20/dashboard')
    win.loadURL('https://auth.api.sonyentertainmentnetwork.com/2.0/oauth/authorize?service_entity=urn:service-entity:psn&response_type=code&client_id=d5e83b44-9f4f-45be-8479-451134e3c9b0&redirect_uri=https://theshownation.com/sessions/oauth&scope=psn:s2s')
    // .then( resolve )
  })
  return prom
}

const dashboardWindow = () => {
  const win = new BrowserWindow({
    width: 1300,
    height: 768,
    webPreferences: {
      webviewTag: true,
      // nodeIntegration: true,
      nodeIntegration: false,
    },
    session: session.defaultSession,
    icon: path.join(__dirname, 'src/icons/48.png')
  })

  win.webContents.session.loadExtension(
    path.join(__dirname, 'src')
  )
  // win.loadURL('https://theshownation.com/mlb20/dashboard')
  win.loadURL('https://theshownation.com/mlb20/shop/packs')
  return win
}
const mainWindow = async () => {
  const win = new BrowserWindow({
    width: 1300,
    height: 768,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      preloadURL: './preload.js',
      preload: './preload.js',
      nodeIntegrationInSubFrames: false,
    },
    session: session.fromPartition('persist:blah'),
    partition: 'persist:blah',
    icon: path.join(__dirname, 'src/icons/48.png')
  })
  // win.openDevTools()

  // win.webContents.session.loadExtension(
  //   path.join(__dirname, 'src')
  // )
  // const view = new BrowserView({
  //   webPreferences: {
  //     webviewTag: true,
  //     nodeIntegration: true,
  //     preloadURL: './preload.js',
  //     preload: './preload.js',
  //   },
  //   session: session.defaultSession,
  //   preloadURL: './preload.js',
  //   preload: './preload.js',
  // })
  // win.setBrowserView(view)
  // view.setBounds({ x: 0, y: 0, width: 300, height: 300 })
  // // await view.webContents.loadURL('https://theshownation.com/dashboard')
  // view.webContents.openDevTools()
  // await view.webContents.loadURL('https://theshownation.com/mlb20/items/87602fc8d5b4989b1fda114b7b4b597c')
  // let script = await require('fs').promises.readFile('./preload.js', 'utf-8')
  //
  // console.log(view.webContents, view.webContents.addEventListener)
  // view.webContents.addEventListener('dom-ready', () => {
  //   view.webContents.executeJavaScript(script)
  // })
  // view.webContents.addEventListener('did-finish-load', () => {
  //   view.webContents.executeJavaScript(script)
  // })
  // console.log(view, view.webContents)
  // view.webContents.executeJavaScript(script)
  win.webContents.loadFile('electron-tabs.html')
  return win
}

function createWindow () {
  // return Promise.resolve().then( mainWindow )
  // return login().then( mainWindow )

  // load the electron window
  // mainWindow()
  // load the dashboard window but login first
  return login().then( dashboardWindow )

  // load the dashboard window
  // return Promise.resolve( dashboardWindow() )
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  let win = createWindow(app)
  app.on('event-browser-window-created', (w) => {
    console.log('event-browser-window-created', w)
  })

  app.on('event-web-contents-created', (w) => {
    console.log('event-web-contents-created',w)
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

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
