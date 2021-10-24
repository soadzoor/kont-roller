var a = getApp();

Page({
    data: {},
    onLoad: function(a) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    scanMac: function() {
        var t = this;
        t.clearAll(), wx.scanCode({
            success: function(e) {
                t.setData({
                    gateRes: !0
                });
                var n = e.result;
                17 != n.length ? t.setData({
                    mess: "MAC地址有误"
                }) : (t.setData({
                    mess: "正在查询..."
                }), wx.request({
                    url: a.url + "/g4/getFirmwareMessage",
                    data: {
                        iotCode: n
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function(a) {
                        console.log(a.data);
                    }
                }), setTimeout(function() {
                    wx.request({
                        url: a.url + "/mq/retGateMess",
                        data: {},
                        header: {
                            "Content-Type": "application/json"
                        },
                        success: function(a) {
                            console.log(a.data), "101" == a.data.code ? t.setData({
                                mess: "网关没有上传数据"
                            }) : "200" == a.data.code ? t.setData({
                                mess: "系统出错"
                            }) : "100" == a.data.code && t.setData({
                                gateRes: !1,
                                mac: a.data.gData.b1,
                                n: a.data.gData.n,
                                d1: a.data.gData.d1,
                                d2: a.data.gData.d2,
                                d3: a.data.gData.d3,
                                d4: a.data.gData.d4,
                                r: a.data.gData.r,
                                h: a.data.gData.h,
                                j: a.data.gData.j,
                                l1: a.data.gData.l1,
                                l2: a.data.gData.l2,
                                l3: a.data.gData.l3,
                                l4: a.data.gData.l4,
                                gateMess: !0
                            });
                        }
                    });
                }, 2e3));
            }
        });
    },
    clearAll: function() {
        this.setData({
            gateRes: !1,
            gateMess: !1,
            mac: "",
            n: "",
            d1: "",
            d2: "",
            d3: "",
            d4: "",
            r: "",
            h: "",
            j: "",
            l1: "",
            l2: "",
            l3: "",
            l4: ""
        });
    }
});