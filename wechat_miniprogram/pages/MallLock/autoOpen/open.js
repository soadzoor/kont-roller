var o = getApp();

require("../../../utils/chikoUtil.js");

Page({
    data: {
        mac: void 0,
        macs: void 0
    },
    onLoad: function(e) {
        var t = this;
        t.check_Ble(), t.data.macs = e.macs, t.setData({
            scanTxt: "正在初始化蓝牙..."
        }), setTimeout(function() {
            1 == o.globalData.ble_type && (t.openBluetoothAdapter(), setTimeout(function() {
                console.log("识别中"), t.setData({
                    scanTxt: "正在识别小程序码..."
                }), t.startBluetoothDevicesDiscovery();
            }, 500), t.data.mac = t.setMac(t.data.macs), setTimeout(function() {
                console.log("连接蓝牙"), t.gatewayOpen();
            }, 1e3));
        }, 500);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {
        clearInterval(o.globalData.timer2);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    openBluetoothAdapter: function() {
        wx.openBluetoothAdapter({
            success: function(o) {
                console.log("打开蓝牙模块"), console.log(o);
            },
            fail: function(o) {
                console.log("-----fail----------"), console.log(o);
            },
            complete: function(o) {
                console.log("-----complete----------"), console.log(o);
            }
        });
    },
    startBluetoothDevicesDiscovery: function() {
        wx.startBluetoothDevicesDiscovery({
            services: [ "FEE7" ],
            success: function(o) {
                console.log("-----startBluetoothDevicesDiscovery--success----------"), console.log(o);
            },
            fail: function(o) {
                console.log(o);
            },
            complete: function(o) {
                console.log(o);
            }
        });
    },
    check_Ble: function() {
        console.log("检查蓝牙是否打开"), wx.openBluetoothAdapter({
            success: function(e) {
                console.log("-----success----------"), o.globalData.ble_type = 1;
            },
            fail: function(e) {
                console.log("-----fail----------"), wx.showModal({
                    title: o.alert,
                    content: "请先打开蓝牙",
                    showCancel: !1,
                    confirmText: "我已打开",
                    success: function(o) {
                        o.confirm && wx.navigateBack({
                            delta: 99
                        });
                    }
                }), o.globalData.ble_type = 0;
            },
            complete: function(o) {
                console.log("-----complete----------");
            }
        });
    },
    getRanNum: function() {
        var o = Math.random();
        return o *= 1e3, o = Math.floor(o);
    },
    setMac: function(o) {
        var e = o, t = "";
        console.log("二维码：", e);
        for (var n = 0; n < e.length; n++) {
            var a = e[n];
            if (":" != a) {
                if (!(a >= "0" && a <= "9" || a >= "A" && a <= "F")) return wx.showModal({
                    title: "二维码格式错误",
                    content: e,
                    showCancel: !1,
                    duration: 2e3
                }), !1;
                t += a;
            }
        }
        return console.log("mac:", t), t;
    },
    gatewayOpen: function() {
        var e = this, t = new Date(), n = t.getMinutes() + ":" + t.getSeconds() + ":" + t.getMilliseconds();
        wx.request({
            url: o.lockUrl + "/gateway/addRecord",
            data: {
                lockMac: e.data.mac,
                time: n
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), "100" == t.data.code ? wx.request({
                    url: o.lockUrl + "/gateway/retGmac",
                    data: {
                        store: "dc店"
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(t) {
                        if (console.log(t.data), "100" == t.data.code) {
                            for (var n = t.data.Gmacs, a = function(t) {
                                setTimeout(function() {
                                    wx.request({
                                        url: o.url + "/g4/MunLock",
                                        data: {
                                            mac: e.data.mac,
                                            userId: 10086,
                                            gMac: n[t]
                                        },
                                        header: {
                                            "Content-Type": "application/json"
                                        },
                                        success: function(o) {
                                            console.log(o.data);
                                        }
                                    });
                                }, e.getRanNum());
                            }, c = 0; c < n.length; c++) a(c);
                            wx.redirectTo({
                                url: "../ble/ble?macs=" + e.data.macs + "&a=10&b=10&c=1&gateway=1"
                            });
                        } else e.alert("未找到网关");
                    }
                }) : e.alert("添加失败");
            }
        });
    }
});