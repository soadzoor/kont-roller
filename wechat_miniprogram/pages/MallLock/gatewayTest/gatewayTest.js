var a = getApp(), t = require("../../../utils/chikoUtil");

Page({
    data: {
        scanList: [],
        gatewayMac: [ "BB:93:16:DE:E3:CA" ]
    },
    onLoad: function(a) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    setMac: function(a) {
        var t = a, c = "";
        console.log("二维码：", t);
        for (var n = 0; n < t.length; n++) {
            var e = t[n];
            if (":" != e) {
                if (!(e >= "0" && e <= "9" || e >= "A" && e <= "F")) return wx.showModal({
                    title: "二维码格式错误",
                    content: t,
                    showCancel: !1,
                    duration: 2e3
                }), !1;
                c += e;
            }
        }
        return console.log("mac:", c), c;
    },
    scanUrl: function() {
        var c = this, n = "", e = c.data.scanList;
        wx.scanCode({
            success: function(o) {
                n = o.result, n = t.Url_updateMac(n), c.data.mac = c.setMac(n), c.data.macs = n, 
                wx.request({
                    url: a.lockUrl + "/lock/checkData",
                    data: {
                        url: n
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(a) {
                        console.log(a.data), "100" == a.data.code || "108" == a.data.code ? (c.setMac(a.data.macs), 
                        e.push({
                            id: a.data.lockid,
                            mac: c.setMac(a.data.macs),
                            macs: a.data.macs
                        }), c.setData({
                            scanList: e
                        }), console.log(c.data.scanList)) : t.Alert("出错");
                    }
                });
            }
        });
    },
    goUnlock: function() {
        for (var a = this.data.scanList, t = 0; t < a.length; t++) this.sentUnlockOther(a[t].mac);
    },
    sentUnlockOther: function(t) {
        var c = this, n = new Date(), e = n.getMinutes() + ":" + n.getSeconds() + ":" + n.getMilliseconds();
        wx.request({
            url: a.lockUrl + "/gateway/addRecord",
            data: {
                lockMac: t,
                time: e
            },
            success: function(n) {
                console.log(n.data), "100" == n.data.code ? setTimeout(function() {
                    for (var n = 0; n < c.data.gatewayMac.length; n++) wx.request({
                        url: a.url + "/g4/MunLock",
                        data: {
                            mac: t,
                            userId: 10086,
                            gMac: c.data.gatewayMac[n]
                        },
                        success: function(a) {
                            console.log(a.data);
                        }
                    });
                }, 10) : c.alert("添加失败");
            }
        });
    },
    getRanNum: function() {
        var a = Math.random();
        return a *= 1e3, a = Math.floor(a);
    }
});