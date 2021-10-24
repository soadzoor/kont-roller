var t = getApp(), a = "", e = "", d = "", o = "", n = "", s = "", r = "", i = "", c = "", l = "", u = "", p = "";

Page({
    data: {
        alert: "正在查询，请稍后..."
    },
    onLoad: function(g) {
        var m = this;
        a = g.result, setTimeout(function() {
            wx.request({
                url: t.url + "/mq/returnStat",
                data: {
                    iotCode: a
                },
                header: {
                    "Content-Type": "application/json"
                },
                success: function(t) {
                    "no" == t.data ? wx.showModal({
                        content: "还未上报状态",
                        showCancel: !1
                    }) : (e = t.data.iotCode, d = t.data.battery, o = t.data.lockVol, 1 == (n = t.data.speedMode) ? n = "低速" : 2 == n ? n = "中速" : 3 == n && (n = "高速"), 
                    s = t.data.speed, r = t.data.odmeter, i = t.data.inderRange, c = t.data.RidingSecs, 
                    0 == (l = t.data.lockStat) ? l = "关锁状态" : 1 == l && (l = "开锁状态"), 0 == (u = t.data.charge) ? u = "当前车辆未充电" : 1 == u && (u = "当前车辆正在充电"), 
                    0 == (p = t.data.ledStat) ? p = "关闭状态" : 1 == p && (p = "打开状态"));
                }
            }), m.setData({
                alert: ""
            });
        }, 1e3), setTimeout(function() {
            m.setData({
                iotCode: e,
                battery: d + "%",
                lockVol: o + "V",
                speedMode: n,
                speed: s + "km/h",
                odmeter: r + "m",
                inderRange: i + "km",
                RidingSecs: c + "°C",
                lockStat: l,
                charge: u,
                ledStat: p
            });
        }, 3200);
    }
});