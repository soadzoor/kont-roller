var t = getApp(), a = {
    scan_qr: "Scan URL code",
    unlock: "Unlock",
    lock: "Lock",
    alert: "Alert",
    scan_frist: "Please scan the MAC code first",
    state: "state",
    location: "location",
    notData: "Not found"
}, o = {
    scan_qr: "扫描 URL 码",
    unlock: "开锁",
    lock: "关锁",
    alert: "寻车",
    scan_frist: "请先扫描二维码",
    state: "状态",
    location: "定位",
    notData: "没有找到数据"
};

module.exports = {
    Fetch_language_lib: function() {
        return "zh_CN" == t.globalData.language ? o : a;
    }
};