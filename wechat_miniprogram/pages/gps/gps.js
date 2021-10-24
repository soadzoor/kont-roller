var t = getApp(), a = "", e = "", o = "", n = "", d = "", i = "", u = "", s = "";

Page({
    data: {
        alert: "正在查询，请稍后..."
    },
    onLoad: function(c) {
        var l = this;
        a = c.result, setTimeout(function() {
            wx.request({
                url: t.url + "/mq/returnGNSS",
                header: {
                    "Content-Type": "application/json"
                },
                data: {
                    iotCode: a
                },
                success: function(t) {
                    "no" == t.data ? wx.showModal({
                        content: "还未上报GNSS",
                        showCancel: !1
                    }) : (e = t.data.iotCode, o = t.data.utc, n = t.data.latitude, d = t.data.longitude, 
                    i = t.data.location, u = t.data.hdop, s = t.data.nsat);
                }
            }), l.setData({
                alert: ""
            });
        }, 500), setTimeout(function() {
            l.setData({
                iotCode: e,
                utc: o,
                latitude: n,
                longitude: d,
                location: i,
                hdop: u,
                nsat: s
            });
        }, 1e3);
    }
});