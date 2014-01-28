var ajax = function(uri, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', uri, true);
    var cbInner = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            return cb(null, xhr.response, uri);
        }
        cb('error requesting ' + uri);
    };
    xhr.onload  = cbInner;
    xhr.onerror = cbInner;
    xhr.send(null);
};
