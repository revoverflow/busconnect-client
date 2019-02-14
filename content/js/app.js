const webview = document.getElementById('webview');

function redirect(url) {
    var baseurl = webview.getURL().replace(/[^/]*$/, '');
    webview.loadURL(baseurl + url);
}