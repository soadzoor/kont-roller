var a = getApp(), e = require("../language/loginLang");

Page({
    data: {
        la_lib: [],
        list: []
    },
    datePickerBindchange: function(a) {
        this.setData({
            dateValue: a.detail.value
        });
    },
    onLoad: function(t) {
        clearInterval(a.globalData.timer2);
        var o = e.Fetch_language_lib();
        this.setData({
            ver: a.version,
            la_lib: o
        });
    },
    onShareAppMessage: function(a) {
        if ("button" === a.from && 1 == a.target.id) return {
            title: "曹哥牛逼！",
            path: "/pages/index/index",
            imageUrl: "../img/logo.jpg"
        };
    },
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading(), setTimeout(function() {
            wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
        }, 1500);
    },
    uuInput: function(a) {
        console.log(a.detail.value), this.setData({
            uname: a.detail.value
        });
    },
    pasWInput: function(a) {
        this.setData({
            pword: a.detail.value
        });
    },
    bindFormSubmit: function(e) {
        console.log(this.data.uname), console.log(this.data.pword);
        var t = this;
        a.userMess.username = t.data.uname, "flash" == this.data.uname && "bind" == this.data.pword ? wx.navigateTo({
            url: "../bind/bind"
        }) : "flash" == this.data.uname && "circ005" == this.data.pword || ("flash" == this.data.uname && "circ006" == this.data.pword ? wx.navigateTo({
            url: "../blueOpen/blueOpen?type=flash"
        }) : "baicycle" == this.data.uname && "net" == this.data.pword ? wx.navigateTo({
            url: "../test/test"
        }) : "baicycle" == this.data.uname && "blue" == this.data.pword ? wx.navigateTo({
            url: "../blueOpen/blueOpen?type=flash"
        }) : "qr" == this.data.uname && "123" == this.data.pword ? wx.navigateTo({
            url: "../qrCompare/qrCompare?type=qr"
        }) : "gc" == this.data.uname && "123" == this.data.pword ? wx.navigateTo({
            url: "../qrCompare/qrCompare?type=yj"
        }) : "gc" == this.data.uname && "123" == this.data.pword ? wx.navigateTo({
            url: "../insertData/delData"
        }) : "tf" == this.data.uname && "123" == this.data.pword ? wx.navigateTo({
            url: "../blueOpen/blueOpen?type=tf"
        }) : "test" == this.data.uname && "000" == this.data.pword ? wx.navigateTo({
            url: "../MallLock/gatewayTest/gatewayTest"
        }) : "tf" == this.data.uname && "000" == this.data.pword ? wx.navigateTo({
            url: "../AutoTest/index/index?admin=tf"
        }) : "tf" == this.data.uname && "888" == this.data.pword ? wx.navigateTo({
            url: "../changeData/changeData"
        }) : wx.request({
            url: a.vehiUrl + "/user/login",
            data: {
                acc: this.data.uname,
                pass: this.data.pword
            },
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                console.log(e.data);
                var o = e.data.role;
                "100" == e.data.code ? (a.userMess.role = e.data.role, a.userMess.account = e.data.account, 
                a.userMess.userAes = e.data.bleKey, a.userMess.openid = e.data.openid, a.userMess.master = e.data.master, 
                console.log("userAes:" + a.userMess.userAes), 0 == o ? (a.userMess.role = 0, wx.navigateTo({
                    url: "../MallLock/index/index?type=1"
                })) : 1 == o ? wx.navigateTo({
                    url: "../auth/choose/choose?user=" + e.data.account
                }) : 2 == o ? wx.navigateTo({
                    url: "../blueOpen/blueOpen?type=yj"
                }) : 21 == o ? wx.navigateTo({
                    url: "../blueOpen/blueOpen?type=" + t.data.uname
                }) : 3 == o ? wx.navigateTo({
                    url: "../blueOpen/blueOpen?type=customer"
                }) : 4 == o ? "gc" == t.data.uname ? wx.navigateTo({
                    url: "../yj/choose/choose"
                }) : "dc" != t.data.uname && "mk" != t.data.uname || wx.navigateTo({
                    url: "../demo/choose/choose"
                }) : 41 == o ? (a.userMess.role = 41, wx.navigateTo({
                    url: "../MallLock/index/index?type=1"
                })) : 42 == o ? wx.navigateTo({
                    url: "../MallLock/index/index?type=2"
                }) : 43 == o ? wx.navigateTo({
                    url: "../MallLock/add/addUrl/addUrl"
                }) : 44 == o ? wx.navigateTo({
                    url: "../MallLock/qr/qr"
                }) : 45 == o ? wx.navigateTo({
                    url: "../MallLock/checkRssi/checkRssi"
                }) : 51 == o && wx.navigateTo({
                    url: "../MallLock/index/index?type=3"
                })) : "200" == e.data.code && wx.showModal({
                    title: "",
                    content: "username or password is wrong",
                    confirmText: t.data.la_lib.confiem,
                    showCancel: !1
                });
            }
        }));
    },
    connWifi: function() {
        wx.startWifi({
            success: function(a) {
                console.log(a.errMsg);
            }
        }), setTimeout(function() {
            wx.connectWifi({
                SSID: "DaChuang",
                password: "dcwl888888",
                success: function(a) {
                    console.log(a.errMsg);
                },
                fail: function(a) {
                    console.log(a.errMsg);
                }
            });
        }, 500);
    },
    regit: function() {
        wx.navigateTo({
            url: "../regit/regit"
        });
    },
    clearSess: function() {
        wx.clearStorageSync(), "" == wx.getStorageSync("bleKey") && wx.showToast({
            title: "success",
            icon: "success"
        });
    },
    checkBle: function() {
        var a = this;
        console.log("检查蓝牙是否打开"), wx.closeBluetoothAdapter({
            success: function(a) {
                console.log("先断开蓝牙模块");
            }
        }), wx.openBluetoothAdapter({
            success: function(e) {
                console.log("-----success----------"), console.log(e), a.state = 1;
            },
            fail: function(a) {
                console.log("-----fail----------"), console.log(a);
            },
            complete: function(a) {
                console.log("-----complete----------"), console.log(a);
            }
        });
    },
    GetMac: function(a) {
        var e = (parseInt(a, 10) >>> 0).toString(16).toUpperCase(), t = e.substring(e.length - 2, e.length);
        return 1 == t.length && (t = "0" + t), t;
    }
});