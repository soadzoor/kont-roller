var t = getApp(), a = require("../../../../utils/chikoUtil"), e = require("../../../../utils/md5Util");

Page({
    data: {
        url: "",
        mac: "",
        macs: "",
        ranNum: void 0,
        userName: "",
        userStore: "",
        lockid: ""
    },
    onLoad: function(a) {
        var o = this;
        wx.openBluetoothAdapter({
            success: function(a) {
                t.globalData.ble_type = 1, setTimeout(function() {
                    o.startBluetoothDevicesDiscovery();
                }, 500);
            },
            fail: function(a) {
                t.globalData.ble_type = 0;
            }
        });
        var s = t.globalData.userid;
        s.startsWith("sanqian") && (o.data.u = "三千物联", s = s.substring(7, s.length), console.log(s), 
        wx.request({
            url: "https://www.huinengsoft.cn/api/sanqiankey/index",
            data: {
                token: e.hexMD5("gwche888888" + s),
                keystate: 1,
                keycode: "1",
                userid: s
            },
            success: function(t) {
                console.log(t.data), "101" == t.data.state ? o.data.auth = !0 : o.data.auth = !1;
            }
        }));
    },
    onShow: function(t) {
        this.startBluetoothDevicesDiscovery();
    },
    getRanNum: function() {
        var t = Math.random();
        return t *= 1e3, t = Math.floor(t);
    },
    scanUrl: function() {
        var e = this;
        if (1 == ("三千物联" == e.data.u && 1 == e.data.auth || "大创" == e.data.u ? 1 : 0)) {
            var o = "";
            wx.scanCode({
                success: function(s) {
                    o = s.result, 17 == (o = a.Url_updateMac(o)).length ? (e.data.mac = e.setMac(o), 
                    e.data.macs = o, wx.request({
                        url: t.lockUrl + "/lock/checkData",
                        data: {
                            url: o
                        },
                        header: {
                            "Content-Type": "application/json"
                        },
                        success: function(t) {
                            console.log(t.data), "101" == t.data.code ? (a.Alert("没有该设备数据"), e.url = void 0) : "100" != t.data.code && "108" != t.data.code || (e.data.lockid = t.data.lockid, 
                            e.data.userName = t.data.user, e.data.userStore = t.data.store, setTimeout(function() {
                                wx.navigateTo({
                                    url: "../open/open?macs=" + e.data.macs + "&lockid=" + e.data.lockid + "&userName=" + e.data.userName + "&userStore=" + e.data.userStore
                                });
                            }, 500));
                        }
                    })) : (a.Alert("二维码不正确"), 0);
                }
            });
        } else a.Alert("您现在无法开锁");
    },
    setMac: function(t) {
        var a = t, e = "";
        console.log("二维码：", a);
        for (var o = 0; o < a.length; o++) {
            var s = a[o];
            if (":" != s) {
                if (!(s >= "0" && s <= "9" || s >= "A" && s <= "F")) return wx.showModal({
                    title: "二维码格式错误",
                    content: a,
                    showCancel: !1,
                    duration: 2e3
                }), !1;
                e += s;
            }
        }
        return console.log("mac:", e), e;
    },
    goScan: function() {
        var a = this, e = new Date(), o = e.getMinutes() + ":" + e.getSeconds() + ":" + e.getMilliseconds();
        wx.request({
            url: t.lockUrl + "/gateway/addRecord",
            data: {
                lockMac: a.data.mac,
                time: o
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data), "100" == e.data.code ? wx.request({
                    url: t.lockUrl + "/gateway/retGmac",
                    data: {
                        store: "dc店"
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(e) {
                        if (console.log(e.data), "100" == e.data.code) {
                            for (var o = e.data.Gmacs, s = function(e) {
                                setTimeout(function() {
                                    wx.request({
                                        url: t.url + "/g4/MunLock",
                                        data: {
                                            mac: a.data.mac,
                                            userId: 10086,
                                            gMac: o[e]
                                        },
                                        header: {
                                            "Content-Type": "application/json"
                                        },
                                        success: function(t) {
                                            console.log(t.data);
                                        }
                                    });
                                }, a.getRanNum());
                            }, c = 0; c < o.length; c++) s(c);
                            wx.navigateTo({
                                url: "../ble/ble?macs=" + a.data.macs + "&a=10&b=10&c=1"
                            });
                        } else a.alert("未找到网关");
                    }
                }) : a.alert("添加失败");
            }
        });
    },
    startBluetoothDevicesDiscovery: function() {
        wx.startBluetoothDevicesDiscovery({
            services: [ "FEE7" ],
            success: function(t) {
                console.log("-----startBluetoothDevicesDiscovery--success----------"), console.log(t);
            },
            fail: function(t) {
                console.log(t);
            },
            complete: function(t) {
                console.log(t);
            }
        });
    },
    Authorize: function(t) {
        console.log("Authorize");
        for (var a, e, o, s = "", c = 0; c < t.length; c++) {
            var n = t[c];
            if (":" != n) {
                if (!(n >= "0" && n <= "9" || n >= "A" && n <= "F")) return void wx.showModal({
                    title: "MAC格式错误",
                    content: t
                });
                s += n;
            }
        }
        var l = [ 0, 0, 0, 0, 0, 0 ];
        for (c = 0; c < s.length; c += 2) l[c / 2] = parseInt(s.substr(c, 2), 16);
        console.log("mac:", s), console.log("array1:", l), a = 41 * (l[0] + l[1] + l[2] + l[3] + l[4] + l[5]), 
        console.log("auth_data:", a), e = 255 & a, o = a >> 8 & 255, console.log("auth_data1:,", e.toString(16)), 
        console.log("auth_data2:,", o.toString(16));
    }
});