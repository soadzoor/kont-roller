Page({
    data: {},
    onLoad: function(o) {},
    onReady: function() {},
    add: function() {
        wx.navigateTo({
            url: "../add/add"
        });
    },
    out: function() {
        wx.navigateTo({
            url: "../out/out"
        });
    },
    drop: function() {
        wx.navigateTo({
            url: "../drop/drop"
        });
    }
});