Page({
    data: {
        rotateIndex: 0
    },
    onLoad: function(t) {},
    onReady: function() {
        var t = this, n = wx.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        });
        this.animation = n, this.refreshList(), setTimeout(function() {
            t.slideupshow();
        }, 500);
    },
    refreshList: function() {
        this.timeInterval = setInterval(function() {
            this.data.rotateIndex = this.data.rotateIndex + 1, this.animation.rotate(360 * this.data.rotateIndex).step(), 
            this.setData({
                animationData: this.animation.export()
            });
        }.bind(this), 1e3), this.request();
    },
    slideupshow: function() {
        var t = wx.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        });
        t.translateY(-50).step(), this.setData({
            animationData2: t.export()
        });
    },
    stopRefresh: function() {
        this.timeInterval > 0 && (clearInterval(this.timeInterval), this.timeInterval = 0);
    },
    request: function() {
        console.log("request");
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});