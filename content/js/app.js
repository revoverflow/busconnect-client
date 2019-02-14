const webview = document.getElementById('webview');
const baseurl = location.href.replace(/[^/]*$/, '');

function redirect(url) {
    webview.loadURL(baseurl + url);
}