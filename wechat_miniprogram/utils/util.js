var r = function(r) {
    return (r = r.toString())[1] ? r : "0" + r;
};

function t(r) {
    for (var t = "", e = 0, a = 0, o = 0, n = 0; e < r.length; ) (a = r.charCodeAt(e)) < 128 ? (t += String.fromCharCode(a), 
    e++) : a > 191 && a < 224 ? (o = r.charCodeAt(e + 1), t += String.fromCharCode((31 & a) << 6 | 63 & o), 
    e += 2) : (o = r.charCodeAt(e + 1), n = r.charCodeAt(e + 2), t += String.fromCharCode((15 & a) << 12 | (63 & o) << 6 | 63 & n), 
    e += 3);
    return t;
}

module.exports = {
    base64_encode: function(r) {
        for (var t, e, a, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", n = 0, c = r.length, h = ""; n < c; ) {
            if (t = 255 & r.charCodeAt(n++), n == c) {
                h += o.charAt(t >> 2), h += o.charAt((3 & t) << 4), h += "==";
                break;
            }
            if (e = r.charCodeAt(n++), n == c) {
                h += o.charAt(t >> 2), h += o.charAt((3 & t) << 4 | (240 & e) >> 4), h += o.charAt((15 & e) << 2), 
                h += "=";
                break;
            }
            a = r.charCodeAt(n++), h += o.charAt(t >> 2), h += o.charAt((3 & t) << 4 | (240 & e) >> 4), 
            h += o.charAt((15 & e) << 2 | (192 & a) >> 6), h += o.charAt(63 & a);
        }
        return h;
    },
    base64_decode: function(r) {
        var e, a, o, n, c, h, d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", i = "", f = 0;
        for (r = r.replace(/[^A-Za-z0-9\+\/\=]/g, ""); f < r.length; ) e = d.indexOf(r.charAt(f++)) << 2 | (n = d.indexOf(r.charAt(f++))) >> 4, 
        a = (15 & n) << 4 | (c = d.indexOf(r.charAt(f++))) >> 2, o = (3 & c) << 6 | (h = d.indexOf(r.charAt(f++))), 
        i += String.fromCharCode(e), 64 != c && (i += String.fromCharCode(a)), 64 != h && (i += String.fromCharCode(o));
        return t(i);
    },
    utf8_decode: t,
    formatTime: function(t) {
        var e = t.getFullYear(), a = t.getMonth() + 1, o = t.getDate(), n = t.getHours(), c = t.getMinutes(), h = t.getSeconds();
        return [ e, a, o ].map(r).join("/") + " " + [ n, c, h ].map(r).join(":");
    }
};