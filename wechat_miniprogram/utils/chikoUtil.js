var t = getApp();

function e(t) {
    for (var e = "", l = 0; l <= t.length; l++) 0 != e.length ? e.length % 3 != 0 ? (e += t[l - 1], 
    e += t[l]) : e += ":" : e += "-";
    return e = (e = e.substr(1, e.length)).substr(0, e.length - 1);
}

module.exports = {
    Url_updateMac: function(t) {
        var l = void 0, n = void 0;
        return 17 != (t = t).length ? (t.startsWith("https://static.dmall.com") ? l = (l = t.split("%")[10]).substr(2, l.length - 1) : t.startsWith("https://res") ? l = (l = t.split("/")[5]).substr(0, l.length - 4) : t.startsWith("https://nxc.wjmzy.cn") ? l = (l = t.split("&")[2]).substr(4, t.length) : t.startsWith("http://weixin.qq.com/q") && (l = t.split("&")[1]), 
        n = e(l)) : n = t, n;
    },
    Mac_InsertMao: e,
    Set_Mac: function(t) {
        var e = t, l = "";
        console.log("二维码：", e);
        for (var n = 0; n < e.length; n++) {
            var s = e[n];
            if (":" != s) {
                if (!(s >= "0" && s <= "9" || s >= "A" && s <= "F")) return wx.showModal({
                    title: "二维码格式错误",
                    content: e,
                    showCancel: !1,
                    duration: 2e3
                }), !1;
                l += s;
            }
        }
        return console.log("mac:", l), l;
    },
    Check_Ble: function() {
        console.log("检查蓝牙是否打开"), wx.openBluetoothAdapter({
            success: function(e) {
                console.log("-----success----------"), t.globalData.ble_type = 1;
            },
            fail: function(e) {
                console.log("-----fail----------"), wx.showModal({
                    title: t.alert,
                    content: "请先打开蓝牙",
                    showCancel: !1,
                    confirmText: "我已打开"
                }), t.globalData.ble_type = 0;
            },
            complete: function(t) {
                console.log("-----complete----------");
            }
        });
    },
    Alert: function(e) {
        wx.showModal({
            title: t.alert,
            content: e,
            showCancel: !1
        });
    },
    checkUrlComplete: function(t) {
        if (console.log(t + " xx"), 194 == t.length || 187 == t.length && t.startsWith("https://static.dmall.com")) {
            return "26company" == t.split("%")[11] && "3Ddachuang" == t.split("%")[12] ? 1 : 0;
        }
        if (68 == t.length && t.startsWith("https://res")) return 16 == t.split("/")[5].length ? 1 : 0;
        if (t.startsWith("https://nxc.wjmzy.cn")) return 16 == t.split("&")[2].length ? 1 : 0;
        if (!t.startsWith("http://weixin.qq.com/q")) return 0;
        try {
            return 12 == t.split("&")[1].length ? 1 : 0;
        } catch (t) {
            return console.log(t), 0;
        }
    }
};