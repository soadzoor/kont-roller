var s = getApp(), t = "", e = "";

function a(t) {
    wx.showModal({
        title: s.alert,
        content: t,
        showCancel: !1
    });
}

Page({
    data: {},
    onLoad: function(s) {},
    scan_qr: function() {
        var s = this;
        wx.scanCode({
            success: function(e) {
                (t = e.result).startsWith("https") || 7 == t.length ? t.startsWith("https") ? s.setData({
                    url_message: "URL: .../" + t.split("/")[4]
                }) : s.setData({
                    url_message: "URL: " + t
                }) : (a("URL格式错误"), t = "");
            }
        });
    },
    scan_iccid: function() {
        var s = this;
        wx.scanCode({
            success: function(t) {
                e = t.result, s.setData({
                    iccid_message: "ICCID: " + e
                });
            }
        });
    },
    insert: function() {
        var c = this;
        "" == t ? a("请先扫描URL码") : "" == e ? a("请先扫描ICCID") : wx.request({
            url: s.vehiUrl + "/vehicle/insertIccid",
            data: {
                url: t,
                iccid: e
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(s) {
                console.log(s.data), "success" == s.data ? (a("录入成功"), t = "", e = "", c.setData({
                    url_message: "",
                    iccid_message: ""
                })) : "url error" == s.data ? (a("URL重复"), t = "", c.setData({
                    url_message: ""
                })) : "iccid error" == s.data ? (a("ICCID重复"), e = "", c.setData({
                    iccid_message: ""
                })) : (a("系统错误"), t = "", e = "", c.setData({
                    url_message: "",
                    iccid_message: ""
                }));
            }
        });
    }
});