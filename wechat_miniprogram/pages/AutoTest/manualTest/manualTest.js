var t = getApp(), e = "", s = "", o = "", a = "1", l = "1", n = "1", i = "1", r = "1", h = "1", g = "1", c = "1", d = "1";

Page({
    data: {
        userid: "268"
    },
    onLoad: function(t) {
        s = t.url, e = t.admin, this.setData({
            vehicleId: s.split("/")[4],
            battMess: "电量：通过",
            keyMess: "按键：通过",
            qlightMess: "前灯：通过",
            wlightMess: "尾灯：通过",
            dlightMess: "底灯：通过",
            brakeMess: "刹把：通过",
            hornMess: "喇叭：通过",
            powerMess: "动力：通过",
            usbMess: "USB：通过"
        }), o = s.split("/")[4];
    },
    battBtn: function() {
        "0" == a ? (a = "1", this.setData({
            battMess: "电量：通过",
            battColor: "rgb(66, 173, 88);"
        })) : (a = "0", this.setData({
            battMess: "电量：不通过",
            battColor: "red"
        }));
    },
    keyBtn: function() {
        "0" == l ? (l = "1", this.setData({
            keyMess: "按键：通过",
            keyColor: "rgb(66, 173, 88);"
        })) : (l = "0", this.setData({
            keyMess: "按键：不通过",
            keyColor: "red"
        }));
    },
    qlightBtn: function() {
        "0" == n ? (n = "1", this.setData({
            qlightMess: "前灯：通过",
            qlightColor: "rgb(66, 173, 88);"
        })) : (n = "0", this.setData({
            qlightMess: "前灯：不通过",
            qlightColor: "red"
        }));
    },
    wlightBtn: function() {
        "0" == i ? (i = "1", this.setData({
            wlightMess: "尾灯：通过",
            wlightColor: "rgb(66, 173, 88);"
        })) : (i = "0", this.setData({
            wlightMess: "尾灯：不通过",
            wlightColor: "red"
        })), console.log(i);
    },
    dlightBtn: function() {
        "0" == r ? (r = "1", this.setData({
            dlightMess: "底灯：通过",
            dlightColor: "rgb(66, 173, 88);"
        })) : (r = "0", this.setData({
            dlightMess: "底灯：不通过",
            dlightColor: "red"
        })), console.log(r);
    },
    brakeBtn: function() {
        "0" == h ? (h = "1", this.setData({
            brakeMess: "刹把：通过",
            brakeColor: "rgb(66, 173, 88);"
        })) : (h = "0", this.setData({
            brakeMess: "刹把：不通过",
            brakeColor: "red"
        })), console.log(h);
    },
    hornBtn: function() {
        "0" == g ? (g = "1", this.setData({
            hornMess: "喇叭：通过",
            hornColor: "rgb(66, 173, 88);"
        })) : (g = "0", this.setData({
            hornMess: "喇叭：不通过",
            hornColor: "red"
        })), console.log(g);
    },
    powerBtn: function() {
        "0" == c ? (c = "1", this.setData({
            powerMess: "动力：通过",
            powerColor: "rgb(66, 173, 88);"
        })) : (c = "0", this.setData({
            powerMess: "动力：不通过",
            powerColor: "red"
        })), console.log(c);
    },
    usbBtn: function() {
        "0" == d ? (d = "1", this.setData({
            usbMess: "USB：通过",
            usbColor: "rgb(66, 173, 88);"
        })) : (d = "0", this.setData({
            usbMess: "USB：不通过",
            usbColor: "red"
        })), console.log(d);
    },
    updateData: function() {
        "" == a || "" == l || "" == n || "" == i || "" == r || "" == h || "" == g || "" == c || "" == d ? wx.showModal({
            title: t.alert,
            content: "部分数据丢失，请重新检查",
            showCancel: !1
        }) : "yj" == e ? wx.request({
            url: t.vehiUrl + "/auto/updateData",
            data: {
                vehicleId: o,
                type: 2,
                targe: 1,
                battled: a,
                anjian: l,
                qlight: n,
                wlight: i,
                dlight: r,
                brake: h,
                horn: g,
                power: c,
                usb: d
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data), "success" == e.data ? (wx.vibrateLong(), wx.showModal({
                    title: t.alert,
                    content: "上传成功！",
                    showCancel: !1
                })) : "fail" == e.data && wx.showModal({
                    title: t.alert,
                    content: "上传失败！请联系大创技术人员。",
                    showCancel: !1
                });
            }
        }) : "tf" == e && wx.request({
            url: t.vehiUrl + "/auto/updateData",
            data: {
                vehicleId: o,
                type: 2,
                targe: 2,
                battled: a,
                anjian: l,
                qlight: n,
                wlight: i,
                dlight: r,
                brake: h,
                horn: g,
                power: c,
                usb: d
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data), "success" == e.data ? wx.showModal({
                    title: t.alert,
                    content: "上传成功！",
                    showCancel: !1
                }) : "fail" == e.data && wx.showModal({
                    title: t.alert,
                    content: "上传失败！请联系大创技术人员。",
                    showCancel: !1
                });
            }
        });
    }
});