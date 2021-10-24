var e = require("../language/language"), t = getApp(), a = "", o = "";

Page({
    data: {
        language_lib: [],
        addrs: [],
        list: [],
        rssi_slider_value: -100,
        rssi_threshod: -100
    },
    onLoad: function(t) {
        var o = this;
        a = t.type;
        var s;
        s = e.Fetch_language_lib(), o.setData({
            language_lib: s
        }), wx.openBluetoothAdapter({
            success: function(e) {
                console.log("-----success----------"), console.log(e);
            },
            fail: function(e) {
                console.log("-----fail----------"), console.log(e);
            },
            complete: function(e) {
                console.log("-----complete----------"), console.log(e);
            }
        }), setTimeout(function() {
            wx.startBluetoothDevicesDiscovery({
                services: [ "FEE7" ],
                success: function(e) {
                    console.log("-----startBluetoothDevicesDiscovery--success----------"), console.log(e);
                },
                fail: function(e) {
                    console.log(e);
                },
                complete: function(e) {
                    console.log(e);
                }
            });
        }, 700), setTimeout(function() {
            wx.getBluetoothDevices({
                success: function(e) {
                    console.log("getBluetoothDevices");
                    var t = [];
                    if (e.devices.length) {
                        for (var a = [], s = 0; s < e.devices.length; s++) {
                            var n = new Int8Array(e.devices[s].advertisData), l = "";
                            if (12 == e.devices[s].advertisData.byteLength) {
                                t.push(e.devices[s]);
                                for (var c = 2; c < 8; c++) l += o.GetMac(n[c]);
                                a.push(l);
                            }
                        }
                        o.setData({
                            addrs: a,
                            list: t
                        }), console.log("设备列表：", o.data.list), console.log("MAC:" + o.data.addrs);
                    }
                },
                fail: function(e) {},
                complete: function(e) {}
            });
        }, 2e3);
    },
    RssifilterValue_change: function(e) {
        this.setData({
            rssi_slider_value: e.detail.value
        });
    },
    RSSI_Filer: function(e) {
        console.log(e), this.setData({
            rssi_threshod: this.data.rssi_slider_value
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.BLEscan();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    BLEscan: function() {
        var e = this;
        wx.getBluetoothDevices({
            success: function(t) {
                console.log("getBluetoothDevices");
                var a = [];
                if (t.devices.length) {
                    for (var o = [], s = 0; s < t.devices.length; s++) {
                        var n = new Int8Array(t.devices[s].advertisData), l = "";
                        if (12 == t.devices[s].advertisData.byteLength) {
                            a.push(t.devices[s]);
                            for (var c = 2; c < 8; c++) l += e.GetMac(n[c]);
                            o.push(l);
                        }
                    }
                    e.setData({
                        addrs: o,
                        list: a
                    }), console.log("设备列表：", e.data.list);
                }
            },
            fail: function(e) {},
            complete: function(e) {}
        });
    },
    BLEconnect: function(e) {
        console.log("Bleconnect");
        var s = this, n = e.currentTarget.id, l = s.data.list[0];
        console.log(e);
        for (var c = 0; c < s.data.addrs.length; c++) n == s.data.addrs[c] && (l = s.data.list[c], 
        t.globalData.rssi1 = l.RSSI, t.globalData.mac1 = n, console.log("connect:", n, l), 
        "mall" != a && s.changeMac(n));
        for (var i = new Int8Array(l.advertisData), r = "", u = 2; u < 8; u++) r += s.GetMac(i[u]), 
        u < 7 && (r += ":");
        console.log("aesaesaes:" + t.globalData.aes), setTimeout(function() {
            "customer" == a && t.userMess.userAes != t.globalData.aes ? wx.showModal({
                title: "",
                content: s.data.language_lib.aes_not_equal,
                showCancel: !1
            }) : "mall" == a ? wx.navigateTo({
                url: "../MallLock/ble/ble?macs=" + r + "&type=user"
            }) : (wx.request({
                url: t.vehiUrl + "/vehicle/addScanData",
                data: {
                    user: t.userMess.username,
                    mac: o
                }
            }), wx.navigateTo({
                url: "../ScanResult_lock2/ScanResult_lock2?dev=" + l.deviceId + "&name=" + l.name + "&mac=" + r + "&flag=1&type=" + a + "&resMac=" + o
            }));
        }, 500);
    },
    changeMac: function(e) {
        var a = this;
        console.log("进来了！");
        for (var s = "", n = 0; n <= e.length; n++) 0 != s.length ? s.length % 3 != 0 ? (s += e[n - 1], 
        s += e[n]) : s += ":" : s += "-";
        s = (s = s.substr(1, s.length)).substr(0, s.length - 1), o = s, wx.request({
            url: t.vehiUrl + "/vehicle/checkDataForMac",
            data: {
                mac: o
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data), "not exist" == e.data ? wx.showModal({
                    title: "",
                    content: a.data.language_lib.chiko_not_Url,
                    showCancel: !1
                }) : (t.globalData.aes = e.data.bleKey, console.log("来了来了！！" + t.globalData.aes));
            },
            fail: function() {
                console.log("程序出错");
            }
        }), console.log("newMac:" + s);
    },
    macInsertMao: function(e) {
        console.log("进来了！");
        for (var t = "", a = 0; a <= e.length; a++) 0 != t.length ? t.length % 3 != 0 ? (t += e[a - 1], 
        t += e[a]) : t += ":" : t += "-";
        t = (t = t.substr(1, t.length)).substr(0, t.length - 1), o = t;
    },
    GetMac: function(e) {
        var t = (parseInt(e, 10) >>> 0).toString(16).toUpperCase(), a = t.substring(t.length - 2, t.length);
        return 1 == a.length && (a = "0" + a), a;
    }
});