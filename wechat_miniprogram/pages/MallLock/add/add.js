var a = getApp(), t = require("../../../utils/chikoUtil.js");

require("../../../utils/util");

Page({
    data: {
        mac: "",
        url: "",
        iccid: "",
        assets: "",
        imei: "",
        state: void 0,
        lockId: ""
    },
    onLoad: function(t) {
        var e = t.type;
        this.mac = "", 1 == e ? this.setData({
            lock: !0
        }) : 2 == e && (clearInterval(a.globalData.timer2), this.setData({
            gate: !0
        }));
    },
    onShow: function() {},
    alert: function(t) {
        wx.showModal({
            title: a.alert,
            content: t,
            showCancel: !1
        });
    },
    setMac: function(a) {
        var t = a, e = "";
        console.log("二维码：", t);
        for (var c = 0; c < t.length; c++) {
            var l = t[c];
            if (":" != l) {
                if (!(l >= "0" && l <= "9" || l >= "A" && l <= "F")) return wx.showModal({
                    title: "二维码格式错误",
                    content: t,
                    showCancel: !1,
                    duration: 2e3
                }), !1;
                e += l;
            }
        }
        return console.log("mac:", e), e;
    },
    scanMac: function() {
        var t = this, e = "";
        wx.scanCode({
            success: function(c) {
                17 == (e = c.result).length ? wx.request({
                    url: a.lockUrl + "/lock/checkMac",
                    data: {
                        mac: e
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(c) {
                        console.log(c.data), "100" == c.data.code ? (t.mac = e, t.setData({
                            mac: t.mac
                        })) : "101" == c.data.code ? (t.alert("该设备已有入库记录"), t.mac = void 0, t.setData({
                            mac: ""
                        })) : "200" == c.data.code ? wx.request({
                            url: a.lockUrl + "/lock/addData",
                            data: {
                                mac: e,
                                order: "YJ后添加"
                            },
                            success: function(a) {
                                "100" == a.data.code ? (t.mac = e, t.setData({
                                    mac: t.mac
                                })) : t.alert("数据库没有此设备");
                            }
                        }) : t.alert("系统出错，请稍后再试");
                    }
                }) : t.alert("MAC格式不正确");
            }
        });
    },
    scanGateWayMac: function() {
        var a = this, t = "";
        wx.scanCode({
            success: function(e) {
                17 == (t = e.result).length ? (a.mac = t, a.setData({
                    mac: a.mac
                })) : a.alert("MAC格式不正确");
            }
        });
    },
    scanImei: function() {
        var a = this, t = void 0;
        wx.scanCode({
            success: function(e) {
                15 == (t = e.result).length ? (a.imei = t, a.setData({
                    imei: a.imei
                })) : a.alert("请扫描正确的IMEI");
            }
        });
    },
    scanUrl: function() {
        var e = this, c = "";
        wx.scanCode({
            success: function(l) {
                (c = l.result).startsWith("YSL") ? (e.url = c, wx.request({
                    url: a.lockUrl + "/url/getId",
                    data: {
                        url: e.url
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(a) {
                        console.log(a.data), "100" == a.data.code || "105" == a.data.code ? (e.lockId = a.data.lockId, 
                        e.setData({
                            lockId: e.lockId
                        })) : "101" == a.data.code ? e.alert("没有记录") : "102" == a.data.code ? e.alert("已经被录入过的URL") : "200" == a.data.code ? e.alert("接口出错") : e.alert("系统出错，请稍后再试");
                    }
                })) : 1 == t.checkUrlComplete(c) ? c == e.macs ? e.alert("请录入正确的URL") : (c.startsWith("http://weixin.qq.com/q") ? e.url = c.split("&")[0] : e.url = t.Url_updateMac(c), 
                wx.request({
                    url: a.lockUrl + "/url/getId",
                    data: {
                        url: e.url
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(a) {
                        console.log(a.data), "100" == a.data.code || "105" == a.data.code ? (e.lockId = a.data.lockId, 
                        e.setData({
                            lockId: e.lockId
                        }), e.url = t.Url_updateMac(c)) : "101" == a.data.code ? e.alert("没有记录") : "102" == a.data.code ? e.alert("已经被录入过的URL") : "200" == a.data.code ? e.alert("接口出错") : e.alert("系统出错，请稍后再试");
                    }
                })) : t.Alert("二维码异常，请退回");
            }
        });
    },
    addLock: function() {
        var t = this;
        null == t.mac || null == t.url ? t.alert("请补全数据再入库") : wx.request({
            url: a.lockUrl + "/lock/bindUrl",
            data: {
                url: t.url,
                mac: t.mac
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(a) {
                console.log(a.data), "100" == a.data.code ? t.alert("入库成功") : t.alert("系统出错，请重新录入"), 
                t.url = void 0, t.mac = void 0, t.setData({
                    mac: "",
                    url: ""
                });
            }
        });
    },
    goBle: function() {
        var a = this;
        console.log(a.url), null == a.mac || null == a.url ? a.alert("请补全数据再点击下一步") : (a.checkBle(), 
        setTimeout(function() {
            console.log("跳转:" + a.mac + "," + a.url), 1 == a.state && wx.navigateTo({
                url: "../ble/ble?macs=" + a.mac + "&new_macs=" + a.url + "&lockId=" + a.lockId + "&yj=add&a=0&b=0"
            });
        }, 500));
    },
    scanIccid: function() {
        var a = this, t = "";
        wx.scanCode({
            success: function(e) {
                5 == (t = e.result).length ? (a.iccid = t, a.setData({
                    iccid: a.iccid
                })) : a.alert("请扫描正确的ICCID");
            }
        });
    },
    scanAssets: function() {
        var a = this;
        wx.scanCode({
            success: function(t) {
                a.assets = t.result, a.setData({
                    assets: a.assets
                });
            }
        });
    },
    addGate: function() {
        var t = this;
        null == t.mac || null == t.iccid || null == t.imei || null == t.assets ? t.alert("请补全数据再入库") : wx.request({
            url: a.lockUrl + "/gateway/addData",
            data: {
                mac: t.mac,
                imei: t.imei,
                iccid: t.iccid,
                assetsNum: "zc_" + t.assets
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(a) {
                console.log(a.data), "100" == a.data.code ? t.alert("入库成功") : "201" == a.data.code ? t.alert("MAC重复") : "202" == a.data.code ? t.alert("ICCID重复") : "203" == a.data.code ? t.alert("IMEI重复") : t.alert("系统出错，请重新录入"), 
                t.iccid = void 0, t.imei = void 0, t.mac = void 0, t.assets = void 0, t.setData({
                    mac: "",
                    imei: "",
                    iccid: "",
                    assets: ""
                });
            }
        });
    },
    macInsertMao: function(a) {
        console.log("进来了！");
        for (var t = "", e = 0; e <= a.length; e++) 0 != t.length ? t.length % 3 != 0 ? (t += a[e - 1], 
        t += a[e]) : t += ":" : t += "-";
        return t = (t = t.substr(1, t.length)).substr(0, t.length - 1);
    },
    checkBle: function() {
        var t = this;
        console.log("检查蓝牙是否打开"), wx.openBluetoothAdapter({
            success: function(a) {
                console.log("-----success----------"), console.log(a), t.state = 1;
            },
            fail: function(e) {
                console.log("-----fail----------"), console.log(e), t.state = 0, wx.showModal({
                    title: a.alert,
                    content: "请先打开蓝牙",
                    showCancel: !1,
                    confirmText: "我已打开"
                });
            },
            complete: function(a) {
                console.log("-----complete----------"), console.log(a);
            }
        });
    }
});