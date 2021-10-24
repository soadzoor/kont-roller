var a = getApp(), t = require("../../../utils/chikoUtil.js");

Page({
    data: {
        url: "",
        mac: "",
        macs: "",
        ranNum: void 0
    },
    onLoad: function(e) {
        var o = this;
        t.Check_Ble(), setTimeout(function() {
            1 == a.globalData.ble_type ? (o.openBluetoothAdapter(), setTimeout(function() {
                o.startBluetoothDevicesDiscovery();
            }, 500)) : t.Alert("请打开蓝牙后重新扫小程序码进入");
        }, 500);
    },
    onShow: function() {},
    getRanNum: function() {
        var a = Math.random();
        return a *= 1e3, a = Math.floor(a);
    },
    alert: function(t) {
        wx.showModal({
            title: a.alert,
            content: t,
            showCancel: !1
        });
    },
    scanUrl: function() {
        var e = this, o = "", c = "";
        wx.scanCode({
            success: function(n) {
                o = n.result, 17 == (o = t.Url_updateMac(o)).length ? (c = "new", e.data.mac = e.setMac(o), 
                e.data.macs = o) : (o = n.result, c = "old"), wx.request({
                    url: a.lockUrl + "/lock/checkData",
                    data: {
                        url: o
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(t) {
                        console.log(t.data), "101" == t.data.code ? (e.alert("没有该设备数据"), e.url = void 0) : (e.url = o, 
                        "new" == c ? wx.request({
                            url: a.lockUrl + "/url/getId",
                            data: {
                                url: e.url
                            },
                            header: {
                                "Content-Type": "application/json"
                            },
                            success: function(a) {
                                console.log(a.data), "100" == a.data.code ? e.setData({
                                    url: a.data.lockId
                                }) : "101" == a.data.code || "108" == a.data.code ? e.alert("没有记录") : "102" == a.data.code || "201" == a.data.code ? e.setData({
                                    url: a.data.lockId
                                }) : "200" == a.data.code ? e.alert("接口出错") : e.alert("系统出错，请稍后再试");
                            }
                        }) : wx.request({
                            url: a.lockUrl + "/lock/retMac",
                            data: {
                                url: o
                            },
                            header: {
                                "Content-Type": "application/json"
                            },
                            success: function(t) {
                                console.log(t.data), "100" == t.data.code ? (e.data.macs = t.data.mac, e.data.mac = e.setMac(e.data.macs), 
                                e.setData({
                                    url: e.data.macs
                                })) : wx.showModal({
                                    title: a.alert,
                                    content: "找不到该数据",
                                    showCancel: !1
                                });
                            }
                        }));
                    }
                });
            }
        });
    },
    setMac: function(a) {
        var t = a, e = "";
        console.log("二维码：", t);
        for (var o = 0; o < t.length; o++) {
            var c = t[o];
            if (":" != c) {
                if (!(c >= "0" && c <= "9" || c >= "A" && c <= "F")) return wx.showModal({
                    title: "二维码格式错误",
                    content: t,
                    showCancel: !1,
                    duration: 2e3
                }), !1;
                e += c;
            }
        }
        return console.log("mac:", e), e;
    },
    goScan: function() {
        var t = this, e = new Date(), o = e.getMinutes() + ":" + e.getSeconds() + ":" + e.getMilliseconds();
        wx.request({
            url: a.lockUrl + "/gateway/addRecord",
            data: {
                lockMac: t.data.mac,
                time: o
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data), "100" == e.data.code ? wx.request({
                    url: a.lockUrl + "/gateway/retGmac",
                    data: {
                        store: "dc店"
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(e) {
                        if (console.log(e.data), "100" == e.data.code) {
                            for (var o = e.data.Gmacs, c = function(e) {
                                setTimeout(function() {
                                    wx.request({
                                        url: a.url + "/g4/MunLock",
                                        data: {
                                            mac: t.data.mac,
                                            userId: 10086,
                                            gMac: o[e]
                                        },
                                        header: {
                                            "Content-Type": "application/json"
                                        },
                                        success: function(a) {
                                            console.log(a.data);
                                        }
                                    });
                                }, t.getRanNum());
                            }, n = 0; n < o.length; n++) c(n);
                            wx.navigateTo({
                                url: "../ble/ble?macs=" + t.data.macs + "&a=10&b=10&c=1"
                            });
                        } else t.alert("未找到网关");
                    }
                }) : t.alert("添加失败");
            }
        });
    }
});