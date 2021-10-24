var t = getApp(), e = require("../../language/netLang"), n = "";

function o() {
    wx.showModal({
        title: "",
        content: "Please scan the MAC code first",
        showCancel: !1
    });
}

Page({
    data: {
        la_lib: []
    },
    onLoad: function(t) {
        var n = e.Fetch_language_lib();
        this.setData({
            la_lib: n
        });
    },
    qr: function() {
        var e = this;
        wx.scanCode({
            success: function(o) {
                console.log(o.result), ((n = o.result).startsWith("https") || 7 == n.length) && wx.request({
                    url: t.vehiUrl + "/vehicle/getMac",
                    data: {
                        url: n
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(t) {
                        console.log(t.data), n = t.data;
                    }
                }), setTimeout(function() {
                    null != n ? e.setData({
                        message: n
                    }) : "no" == n && (e.setData({
                        message: e.la_lib.notData
                    }), n = null);
                }, 500);
            }
        });
    },
    open: function() {
        "" == n || null == n ? o() : wx.request({
            url: t.url + "/g4/unLock",
            data: {
                iotCode: n
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data);
            }
        });
    },
    lock: function() {
        "" == n || null == n ? o() : wx.request({
            url: t.url + "/g4/lock",
            data: {
                iotCode: n
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data);
            }
        });
    },
    alert: function() {
        "" == n || null == n ? o() : wx.request({
            url: t.url + "/g4/sendAlert",
            data: {
                iotCode: n,
                type: 1
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data);
            }
        });
    },
    stat: function() {
        "" == n || null == n ? o() : wx.request({
            url: t.url + "/g4/vehicleStatus",
            data: {
                iotCode: n,
                second: 0
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), wx.showToast({
                    title: "wait",
                    icon: "loading",
                    duration: 2e3
                }), setTimeout(function() {
                    wx.navigateTo({
                        url: "../../stat/stat?result=" + n
                    });
                }, 2e3);
            }
        });
    },
    gps: function() {
        "" == n || null == n ? o() : wx.request({
            url: t.url + "/g4/reportGNSS",
            data: {
                iotCode: n,
                second: 0
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), wx.showToast({
                    title: "wait",
                    icon: "loading",
                    duration: 2e3
                }), setTimeout(function() {
                    wx.navigateTo({
                        url: "../../gps/gps?result=" + n
                    });
                }, 2e3);
            }
        });
    }
});