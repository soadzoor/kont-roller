var e = getApp(), t = require("../../language/language"), o = "", a = "", l = "", n = "", s = "", c = "";

Page({
    data: {},
    onLoad: function(e) {
        var a;
        a = t.Fetch_language_lib(), this.setData({
            language_lib: a
        }), o = e.admin;
    },
    QRurl: function() {
        var t = this;
        wx.scanCode({
            success: function(o) {
                console.log("URL_result:" + o.result), (a = o.result).startsWith("https") ? wx.request({
                    url: e.vehiUrl + "/vehicle/checkData",
                    data: {
                        url: a
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(e) {
                        console.log(e.data), "not exist" == e.data ? t.setData({
                            message: "设备不存在于数据库"
                        }) : (l = e.data.vehicleId, n = e.data.mac, s = e.data.imei, c = e.data.iccid, t.setData({
                            message: "查询成功",
                            VehicleId: "车辆ID:" + l,
                            mac: "MAC:" + n,
                            imei: "IMEI:" + s,
                            iccid: "ICCID:" + c,
                            SOHtest: !0
                        }));
                    }
                }) : wx.showModal({
                    title: e.alert,
                    confirmColor: "red",
                    content: "URL格式错误",
                    showCancel: !1
                });
            }
        });
    },
    GoTest: function() {
        if ("" == n || null == n) wx.showModal({
            title: e.alert,
            confirmColor: "red",
            content: "MAC为空",
            showCancel: !1
        }); else {
            if (wx.request({
                url: e.vehiUrl + "/auto/insertData",
                data: {
                    vehicleId: a.split("/")[4]
                },
                header: {
                    "Content-Type": "application/json"
                },
                success: function(t) {
                    console.log(t.data), "success" == t.data ? console.log("加入成功") : "fail" == t.data && (console.log("加入失败"), 
                    wx.showModal({
                        title: e.alert,
                        content: "加入失败",
                        showCancel: !1
                    }));
                }
            }), n.indexOf(":") >= 0) {
                for (var t = "", l = 0; l < n.length; l++) {
                    var s = n[l];
                    if (":" != s) {
                        if (!(s >= "0" && s <= "9" || s >= "A" && s <= "F")) return wx.showModal({
                            title: "二维码格式错误",
                            content: n,
                            showCancel: !1,
                            duration: 2e3
                        }), !1;
                        t += s;
                    }
                }
                n = t;
            }
            wx.openBluetoothAdapter({
                success: function(e) {
                    console.log("-----success----------"), console.log(e), setTimeout(function() {
                        wx.navigateTo({
                            url: "../bleTest/bleTest?url=" + a + "&mac=" + n + "&admin=" + o
                        });
                    }, 1e3);
                },
                fail: function(t) {
                    console.log("-----fail----------"), console.log(t), wx.showModal({
                        title: e.alert,
                        content: "蓝牙未打开！请返回上级界面",
                        showCancel: !1
                    });
                },
                complete: function(e) {
                    console.log("-----complete----------"), console.log(e);
                }
            });
        }
    }
});