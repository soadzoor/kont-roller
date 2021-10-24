require("../AES/aes");

var a = require("../language/language"), e = getApp(), t = "", l = "";

Page({
    data: {
        bleInitOK: !1,
        mac: "",
        language_lib: []
    },
    onLoad: function(e) {
        var l = this;
        t = e.type, console.log(t), "flash" == t ? l.setData({
            sOrh: !0
        }) : l.setData({
            sOrh: !1
        });
        var o, n = [ 1, 23, 4, 5, 6, 12, 231, 45, 65, 32, 65, 33, 45, 5, 12 ];
        console.log(n.slice(1, n.length)), console.log(Math.floor(1e3 * Math.random() % 255)), 
        o = a.Fetch_language_lib(), console.log("language:", o.scan_QR), l.setData({
            language_lib: o
        }), wx.openBluetoothAdapter({
            success: function(a) {
                console.log("-----success----------"), console.log(a), l.setData({
                    bleInitOK: !0
                });
            },
            fail: function(a) {
                console.log("-----fail----------"), console.log(a);
            },
            complete: function(a) {
                console.log("-----complete----------"), console.log(a);
            }
        });
    },
    BLEscan: function(a) {
        console.log("BLEscan");
        this.data.bleInitOK ? wx.navigateTo({
            url: "../devices/devices?type=" + t
        }) : console.log("蓝牙初始化失败");
    },
    setAes: function(a) {
        var l = this;
        wx.request({
            url: e.vehiUrl + "/vehicle/checkDataForMac",
            data: {
                mac: a
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), "not exist" == t.data ? (wx.showModal({
                    title: "",
                    content: l.data.language_lib.chiko_not_Url,
                    showCancel: !1
                }), e.globalData.aes = e.defaultAES) : (e.globalData.aes = t.data.bleKey, console.log("后台查到的密钥:" + e.globalData.aes), 
                wx.request({
                    url: e.vehiUrl + "/vehicle/addScanData",
                    data: {
                        user: e.userMess.username,
                        mac: a
                    }
                }));
            },
            fail: function() {
                console.log("程序出错");
            }
        }), setTimeout(function() {
            if ("customer" != t || e.userMess.userAes == e.globalData.aes) if ("Victor" == t) {
                if ("F0:77:01:59:A4:CA" != a && "F8:F1:7F:A7:84:F9" != a) return void wx.showModal({
                    title: "",
                    content: l.data.language_lib.aes_not_equal,
                    showCancel: !1
                });
                l.QRResultLegal2(a) && wx.navigateTo({
                    url: "../ScanResult_lock2/ScanResult_lock2?mac=" + l.data.mac + "&flag=0&type=" + t + "&resMac=" + a
                });
            } else if ("Matteo" == t) {
                if ("CE:85:E8:E9:B0:FB" != a && "42:6E:0F:7A:69:F1" != a) return void wx.showModal({
                    title: "",
                    content: l.data.language_lib.aes_not_equal,
                    showCancel: !1
                });
                l.QRResultLegal2(a) && wx.navigateTo({
                    url: "../ScanResult_lock2/ScanResult_lock2?mac=" + l.data.mac + "&flag=0&type=" + t + "&resMac=" + a
                });
            } else "flash" == t ? l.QRResultLegal2(a) && wx.navigateTo({
                url: "../ScanResult_lock2/ScanResult_lock2?mac=" + l.data.mac + "&flag=0&type=" + t + "&resMac=" + a
            }) : l.QRResultLegal2(a) && (console.log("跳转到扫描设备界面"), console.log("that.mac:" + l.data.mac), 
            console.log("type:" + t), console.log("mac:" + a), wx.navigateTo({
                url: "../ScanResult_lock2/ScanResult_lock2?mac=" + l.data.mac + "&flag=0&type=" + t + "&resMac=" + a
            })); else wx.showModal({
                title: "",
                content: l.data.language_lib.aes_not_equal,
                showCancel: !1
            });
        }, 500);
    },
    QRconnect: function(a) {
        console.log("QRconnect");
        var e = this;
        e.data.bleInitOK ? wx.scanCode({
            success: function(a) {
                console.log(a), console.log(a.result[0]), e.setAes(a.result);
            }
        }) : wx.showModal({
            title: e.data.language_lib.ble_init_failed,
            content: e.data.language_lib.open_bt_first,
            showCancel: !1,
            duration: 2e3
        });
    },
    QRResultLegal: function(a) {
        var e = a.result, t = "";
        if (console.log("二维码：", e), "QR_CODE" != a.scanType) return wx.showModal({
            title: "二维码格式错误",
            content: e,
            showCancel: !1,
            duration: 2e3
        }), !1;
        for (var l = 0; l < e.length; l++) {
            var o = e[l];
            if (":" != o) {
                if (!(o >= "0" && o <= "9" || o >= "A" && o <= "F")) return wx.showModal({
                    title: "二维码格式错误",
                    content: e,
                    showCancel: !1,
                    duration: 2e3
                }), !1;
                t += o;
            }
        }
        return console.log("mac:", t), this.setData({
            mac: t
        }), !0;
    },
    QRResultLegal2: function(a) {
        var e = a, t = "";
        console.log("二维码：", e);
        for (var l = 0; l < e.length; l++) {
            var o = e[l];
            if (":" != o) {
                if (!(o >= "0" && o <= "9" || o >= "A" && o <= "F")) return wx.showModal({
                    title: "二维码格式错误",
                    content: e,
                    showCancel: !1,
                    duration: 2e3
                }), !1;
                t += o;
            }
        }
        return console.log("mac:", t), this.setData({
            mac: t
        }), !0;
    },
    UrlScan: function() {
        var a = this;
        a.data.bleInitOK ? wx.scanCode({
            success: function(t) {
                console.log(t.result), (l = t.result).startsWith("https") || 7 == l.length || l.startsWith("http") ? wx.request({
                    url: e.vehiUrl + "/vehicle/getMac",
                    data: {
                        url: l
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(t) {
                        if (console.log(t.data), "no" == t.data) return wx.vibrateLong(), void wx.showModal({
                            title: e.alert,
                            confirmColor: "#FF0000",
                            content: a.data.language_lib.chiko_not_Url,
                            showCancel: !1
                        });
                        t.data, a.setAes(t.data);
                    }
                }) : (wx.vibrateLong(), wx.showModal({
                    title: e.alert,
                    content: a.data.language_lib.chiko_error_Url,
                    showCancel: !1
                }));
            }
        }) : wx.showModal({
            title: a.data.language_lib.ble_init_failed,
            content: a.data.language_lib.open_bt_first,
            showCancel: !1,
            duration: 2e3
        });
    }
});