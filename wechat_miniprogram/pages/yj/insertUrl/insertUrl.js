var t = getApp(), a = "", e = "", s = "", n = "";

function c(a) {
    wx.showModal({
        title: t.alert,
        content: a,
        showCancel: !1
    });
}

Page({
    data: {},
    onLoad: function(t) {
        "tem" == t.type && this.setData({
            tem: !0
        });
    },
    alert: function(a) {
        wx.showModal({
            title: t.alert,
            content: a,
            showCancel: !1
        });
    },
    scan_qr: function() {
        var t = this;
        wx.scanCode({
            success: function(e) {
                (a = e.result).startsWith("https") || 7 == a.length ? a.startsWith("https") ? t.setData({
                    url_message: "URL: .../" + a.split("/")[4]
                }) : t.setData({
                    url_message: "URL: " + a
                }) : a.startsWith("http://app.fisssa.fr") ? t.setData({
                    url_message: "URL: .../" + a.split("/")[4]
                }) : (c("URL格式错误"), a = "");
            }
        });
    },
    scan_mac: function() {
        var t = this;
        wx.scanCode({
            success: function(a) {
                e = a.result, t.setData({
                    mac_message: "MAC: " + e
                });
            }
        });
    },
    scan_iccid: function() {
        var t = this;
        wx.scanCode({
            success: function(a) {
                var e = a.result;
                26 == e.length && (e = e.substr(0, e.length - 7)), console.log(e.length), 15 != e.length && 19 != e.length && 18 != e.length || (s = e, 
                t.setData({
                    iccid_message: "ICCID：" + s
                }));
            }
        });
    },
    scan_imei: function() {
        var t = this;
        wx.scanCode({
            success: function(a) {
                var e = a.result;
                15 == e.length && (n = e, t.setData({
                    imei_message: "IMEI：" + n
                }));
            }
        });
    },
    insert: function() {
        var i = this;
        "" == a ? (c("请先扫描URL码"), i.setData({
            url_message: ""
        })) : "" == e ? (c("请先扫描MAC"), i.setData({
            mac_message: ""
        })) : "" == s ? (c("请先扫描ICCID"), i.setData({
            iccid_message: ""
        })) : "" == n ? (c("请先扫描IMEI"), i.setData({
            imei_message: ""
        })) : wx.request({
            url: t.vehiUrl + "/vehicle/InsertData24g",
            data: {
                url: a,
                mac: e,
                iccid: s,
                imei: n
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                console.log(t.data), "100" == t.data ? (i.alert("绑定成功"), e = "", a = "", s = "", 
                n = "", i.setData({
                    url_message: "",
                    mac_message: "",
                    iccid_message: "",
                    imei_message: ""
                })) : "101" == t.data ? i.alert("数据库出现错误") : "103" == t.data ? i.alert("数据库已有记录") : "201" == t.data ? (i.alert("URL重复"), 
                a = "", i.setData({
                    url_message: ""
                })) : "202" == t.data ? (i.alert("MAC重复"), e = "", i.setData({
                    mac_message: ""
                })) : "203" == t.data ? (i.alert("ICCID重复"), s = "", i.setData({
                    iccid_message: ""
                })) : "204" == t.data ? (i.alert("IMEI重复"), n = "", i.setData({
                    imei_message: ""
                })) : i.alert("未知错误，请联系相关人员");
            }
        });
    },
    changeMac: function(t) {
        var a = t, e = "";
        console.log("二维码：", a);
        for (var s = 0; s < a.length; s++) {
            var n = a[s];
            if (":" != n) {
                if (!(n >= "0" && n <= "9" || n >= "A" && n <= "F")) return wx.showModal({
                    title: "二维码格式错误",
                    content: a,
                    showCancel: !1,
                    duration: 2e3
                }), !1;
                e += n;
            }
        }
        return console.log("mac:", e), this.setData({
            mac: e
        }), e;
    },
    setIccid: function(t) {
        s = t.detail.value;
    }
});