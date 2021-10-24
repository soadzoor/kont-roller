var t = getApp(), e = "", o = "";

Page({
    data: {},
    onLoad: function(t) {
        var o = (e = t.url).split("/")[4];
        this.setData({
            urlMess: ".../" + o
        });
    },
    qrIccid: function() {
        var e = this;
        wx.scanCode({
            success: function(n) {
                console.log(n.result), 19 == (o = n.result).length || 20 == o.length ? o.startsWith("8988303000000") ? e.setData({
                    iccMess: o
                }) : (wx.showModal({
                    title: t.alert,
                    content: "该ICCID非外国，禁止录入",
                    showCancel: !1
                }), o = "") : (wx.showModal({
                    title: t.alert,
                    content: "请确认ICCID二维码是否正确",
                    showCancel: !1
                }), o = "");
            }
        });
    },
    insert: function() {
        "" == o ? wx.showModal({
            title: t.alert,
            content: "请先扫描ICCID二维码",
            showCancel: !1
        }) : wx.request({
            url: t.vehiUrl + "/vehicle/insertIccid",
            data: {
                url: e,
                iccid: o
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                var n = e.data;
                "success" == n ? (wx.vibrateLong(), wx.showModal({
                    title: t.alert,
                    content: "更新成功！是否返回上一级？",
                    cancelText: "否",
                    confirmText: "是",
                    success: function(t) {
                        t.cancel || t.confirm && (o = "", wx.redirectTo({
                            url: "../qrCompare/qrCompare?type=yj2"
                        }));
                    }
                })) : "not exsit" == n ? wx.showModal({
                    title: t.alert,
                    content: "设备不存在数据库",
                    showCancel: !1
                }) : "error" == n || "undefind error" == n ? wx.showModal({
                    title: t.alert,
                    content: "系统正在维护，暂时无法入库",
                    showCancel: !1
                }) : "url error" == n ? wx.showModal({
                    title: t.alert,
                    content: "把头二维码出现重复",
                    showCancel: !1
                }) : "iccid error" == n && wx.showModal({
                    title: t.alert,
                    content: "ICCID码出现重复",
                    showCancel: !1
                });
            }
        });
    }
});