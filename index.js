const {
  app,
  BrowserWindow
} = require('electron')

const config = require("./config.json");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 480,
    fullscreen: config.fullscreen,
    frame: false
  });

  win.loadFile(__dirname + '/content/index2.html');

  win.on('closed', () => {
    win = null
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});