App({
    url: "https://dev.picasau.com/MqttPub",
    vehiUrl: "https://dev.picasau.com/VehicleSystem",
    lockUrl: "https://dev.picasau.com/MallLock",
    temUrl: "http://192.168.1.162:8080/Temperature",
    alert: "大创提示",
    version: "2.1.2",
    defaultAES: "35B0B4C3DB1673DE379A60000D35DE11",
    onLaunch: function(e) {
        var t = this, a = this;
        null != e.referrerInfo.extraData && (this.globalData.userid = e.referrerInfo.extraData.userid);
        var o = wx.getStorageSync("logs") || [];
        if (o.unshift(Date.now()), wx.setStorageSync("logs", o), wx.login({
            success: function(e) {
                var t = a.vehiUrl + "/wl/reOpen";
                wx.request({
                    url: t,
                    data: {
                        code: e.code
                    },
                    method: "GET",
                    success: function(e) {
                        a.openid = e.data;
                    },
                    fail: function(e) {
                        console.log("请求失败");
                    }
                });
            }
        }), wx.getSetting({
            success: function(e) {
                e.authSetting["scope.userInfo"] && wx.getUserInfo({
                    success: function(e) {
                        t.globalData.userInfo = e.userInfo, t.userInfoReadyCallback && t.userInfoReadyCallback(e);
                    }
                });
            }
        }), wx.canIUse("getUpdateManager")) {
            var n = wx.getUpdateManager();
            n.onCheckForUpdate(function(e) {
                e.hasUpdate && (n.onUpdateReady(function() {
                    wx.showModal({
                        title: "大创提示",
                        content: "发现新版本，是否重启应用？",
                        success: function(e) {
                            e.confirm && n.applyUpdate();
                        }
                    });
                }), n.onUpdateFailed(function() {
                    wx.showModal({
                        title: "已经有新版本了哟~",
                        content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
                    });
                }));
            });
        } else wx.showModal({
            title: "提示",
            content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
        });
        var s = wx.getSystemInfoSync();
        console.log("sys info:", s), this.globalData.language = s.language;
    },
    globalData: {
        userInfo: null,
        language: "123",
        rssi1: 0,
        mac1: "",
        aes: "",
        ble_type: void 0,
        aes2: "35B0B4C3DB1673DE379A60000D35DE11",
        timer1: null,
        timer2: null,
        userid: void 0
    },
    userMess: {
        role: null,
        account: "",
        openid: "",
        master: "",
        userAes: "",
        username: ""
    },
    lockMessage: {
        macs: "",
        url: "",
        yorder: "",
        batt: "",
        pwd: "",
        version: ""
    },
    timeMessage: {
        goHour: 0,
        goMin: 0,
        endHour: 0,
        endMin: 0
    },
    Timer3: {
        timer3: void 0,
        min: 0,
        sec: 0
    },
    Malluser: {
        openid: void 0,
        integral: void 0
    }
});