const {
  app,
  BrowserWindow
} = require('electron')

let win

function createWindow() {
  win = new BrowserWindow({
    width: 480,
    height: 320,
    fullscreen: true,
    frame: false
  });

  win.loadFile(__dirname + '/content/index.html');

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