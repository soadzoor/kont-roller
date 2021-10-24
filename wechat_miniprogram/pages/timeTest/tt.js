var t;

Page({
    data: {
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        timecount: "00:00:00",
        cost: 0,
        flag: 1,
        endtime: ""
    },
    onLoad: function() {
        console.log([ "a", "b", "c" ].length);
    },
    start: function() {
        var i = this;
        clearInterval(t), i.setData({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0
        }), t = setInterval(function() {
            i.timer();
        }, 50);
    },
    stop: function() {
        clearInterval(t);
    },
    Reset: function() {
        clearInterval(t), this.setData({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
            timecount: "00:00:00"
        });
    },
    timer: function() {
        console.log(this.data.millisecond), this.setData({
            millisecond: this.data.millisecond + 5
        }), this.data.millisecond >= 100 && this.setData({
            millisecond: 0,
            second: this.data.second + 1
        }), this.data.second >= 60 && this.setData({
            second: 0,
            minute: this.data.minute + 1
        }), this.data.minute >= 60 && this.setData({
            minute: 0,
            hour: this.data.hour + 1
        }), this.setData({
            timecount: this.data.hour + ":" + this.data.minute + ":" + this.data.second + ":" + this.data.millisecond
        });
    }
});