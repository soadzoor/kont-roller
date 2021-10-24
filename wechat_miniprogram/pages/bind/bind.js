var e = getApp(), t = "", a = "", n = "", s = "";

Page({
    data: {},
    onLoad: function(e) {
        t = "", a = "", n = "", s = "";
    },
    vehQr: function() {
        var e = this;
        wx.scanCode({
            success: function(n) {
                console.log(n.result);
                var s = (t = n.result).indexOf("https");
                0 == s ? (a = t.split("/")[4], e.setData({
                    vehCode: "vehicleCode : " + a
                })) : -1 == s && (wx.showModal({
                    title: "",
                    content: "Wrong vehicleCode,please scanning vehicle code again",
                    showCancel: !1
                }), e.setData({
                    vehCode: ""
                }), t = "");
            }
        });
    },
    iotQr: function() {
        var e = this;
        wx.scanCode({
            success: function(t) {
                console.log(t.result), 17 != (n = t.result).length ? (wx.showModal({
                    title: "",
                    content: "Wrong macCode,please scanning mac code again",
                    showCancel: !1
                }), e.setData({
                    iotCode: ""
                }), n = "") : e.setData({
                    iotCode: "macCode : " + n
                });
            }
        });
    },
    imeiQr: function() {
        var e = this;
        wx.scanCode({
            success: function(t) {
                console.log(t.result), 15 != (s = t.result).length ? (wx.showModal({
                    title: "",
                    content: "Wrong imeiCode,please scanning imei code again",
                    showCancel: !1
                }), e.setData({
                    imeiCode: ""
                }), s = "") : e.setData({
                    imeiCode: "imeiCode : " + s
                });
            }
        });
    },
    bind: function() {
        var o = this;
        "" == a || null == a ? wx.showModal({
            title: "",
            content: "Please scanning vehicle code",
            showCancel: !1
        }) : "" == n || null == n ? wx.showModal({
            title: "",
            content: "Please scanning mac code",
            showCancel: !1
        }) : "" == s || null == s ? wx.showModal({
            title: "",
            content: "Please scanning imei code",
            showCancel: !1
        }) : wx.request({
            url: e.vehiUrl + "/vehicle/addVehicle",
            data: {
                url: t,
                mac: n,
                imei: s,
                targe: "4"
            },
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(e) {
                console.log(e.data), "success" == e.data ? o.setData({
                    reset: "Continue bindings",
                    res: "Bind success"
                }) : "imei error" == e.data ? (o.setData({
                    res: "imei repeat",
                    reset: "Re bindings"
                }), t = "", a = "", n = "", s = "") : "url error" == e.data ? (o.setData({
                    res: "url repeat",
                    reset: "Re bindings"
                }), t = "", a = "", n = "", s = "") : "mac error" == e.data ? (o.setData({
                    res: "mac repeat",
                    reset: "Re bindings"
                }), t = "", a = "", n = "", s = "") : "error" == e.data && (o.setData({
                    res: "Bind failure",
                    reset: "Re bindings"
                }), t = "", a = "", n = "");
            },
            fail: function(e) {
                o.setData({
                    reset: "Re bindings",
                    res: "Bind failure",
                    vehCode: "",
                    iotCode: "",
                    imeiCode: ""
                }), t = "", a = "", n = "", s = "";
            }
        });
    },
    reset: function() {
        this.setData({
            vehCode: "",
            iotCode: "",
            imeiCode: "",
            res: "",
            reset: ""
        }), a = "", n = "", s = "";
    }
});