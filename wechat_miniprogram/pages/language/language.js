var e = getApp(), o = {
    scan_QR: "SCAN_QR",
    search_and_connect: "SEARCHING",
    scan_Url: "SCAN_URL",
    connected: "connected",
    disconnected: "disconnected",
    connecting: "connecting",
    scanning: "scanning",
    opened: "opened",
    closed: "closed",
    on: "on",
    off: "off",
    ble_name: "ble name",
    ble_state: "ble state",
    sw: "sw",
    batt: "batt",
    lock_state: "lock",
    led_band: "led_band",
    speed: "speed",
    cur_mil: "range",
    charge_state: "charging",
    work_mode: "mode",
    batt_low: "batt low",
    cruise: "cruise",
    nz_act: "nz_spd_start",
    acc_spd_lv: "acc lv",
    lmt_spd: "limited speed",
    rt_interval: "rsp interval",
    cur_sys_cfg: "system config",
    ledband_on: "ledband on",
    ledband_off: "ledband off",
    ledfront_on: "ledfront on",
    ledfront_off: "ledfront off",
    ledtail_on: "ledtail on",
    ledtail_off: "ledtail off",
    ledbottom_on: "ledbottom on",
    ledbottom_off: "ledbottom off",
    unlock: "unlock",
    lock: "lock",
    transport_mode: "transport mode",
    normal_node: "normal mode",
    transport: "transport",
    normal: "normal",
    factory_rst: "factory reset",
    server_rst: "server reset",
    sensor_alarm: "sensor alarm",
    lmt_spd_set: "limited speed",
    charging: "charging",
    uncharged: "uncharged",
    input_err: "input error",
    confirm: "confirm",
    cancel: "cancel",
    refresh: "refresh",
    err_info: "err_info",
    nulls: "null",
    batt_com_err: "batt_com_err",
    ctr_com_err: "ctr_com_err",
    send_cmd_failed: "send cmd failed",
    ble_init_failed: "ble init failed",
    open_bt_first: "please turn on BT",
    qr_error_message: "Bad equipment",
    dian: "Change battery value",
    chiko_error_Url: "Incorrect URL format",
    chiko_not_Url: "Not MAC in the database",
    chiko_max_speed: "Please enter the maximum speed limit.",
    chiko_start_test: "Start testing",
    chiko_sensor_level: "Sensor level",
    chiko_sensor_close: "close",
    chiko_sensor_low: "low",
    chiko_sensor_midding: "midding",
    chiko_sensor_high: "high",
    notAES: "No new AES found",
    aes_not_equal: "You have no right",
    unlock_lock_battery: "Unlock Battery Lock",
    lock_lock_battery: "Lock Battery Lock",
    ulock_wheel: "Ulock Wheel Hub",
    lock_wheel: "Lock Wheel Hub",
    set_userid: "Set user id",
    get_userid: "Get user id"
}, n = {
    scan_QR: "扫码连接",
    search_and_connect: "搜索设备",
    scan_Url: "扫描URL",
    connected: "连接成功",
    disconnected: "断开连接",
    connecting: "连接中",
    scanning: "扫描中",
    opened: "开",
    closed: "关",
    on: "开",
    off: "关",
    ble_name: "蓝牙名称",
    ble_state: "蓝牙状态",
    sw: "软件版本",
    batt: "电量",
    lock_state: "锁状态",
    led_band: "灯条",
    speed: "速度",
    cur_mil: "里程",
    charge_state: "充电",
    work_mode: "模式",
    batt_low: "低电界限",
    cruise: "巡航",
    nz_act: "非零启动",
    acc_spd_lv: "加速等级",
    lmt_spd: "最高限速",
    rt_interval: "信息上报间隔",
    cur_sys_cfg: "当前配置信息",
    ledband_on: "开灯条",
    ledband_off: "关灯条",
    ledfront_on: "开前灯",
    ledfront_off: "关前灯",
    ledtail_on: "开尾灯",
    ledtail_off: "关尾灯",
    ledbottom_on: "开底灯",
    ledbottom_off: "关底灯",
    unlock: "开锁",
    lock: "关锁",
    transport_mode: "运输模式",
    normal_node: "正常模式",
    transport: "运输",
    normal: "正常",
    factory_rst: "恢复出厂值",
    server_rst: "恢复默认服务器",
    sensor_alarm: "sensor报警",
    lmt_spd_set: "设置限速",
    charging: "充电中",
    uncharged: "未充电",
    input_err: "输入错误",
    confirm: "确认",
    cancel: "取消",
    refresh: "刷新",
    err_info: "错误信息",
    nulls: "无",
    batt_com_err: "电池通信异常",
    ctr_com_err: "控制器通信异常",
    send_cmd_failed: "命令发送失败",
    ble_init_failed: "蓝牙初始失败",
    open_bt_first: "请先打开蓝牙",
    qr_error_message: "不良品扫描把头二维码",
    dian: "修改低电阀值",
    chiko_error_Url: "URL格式不对",
    chiko_not_Url: "数据库找不到该URL的MAC",
    chiko_max_speed: "请输入最高限速",
    chiko_start_test: "开始测试",
    chiko_sensor_level: "报警级别",
    chiko_sensor_close: "关",
    chiko_sensor_low: "低",
    chiko_sensor_midding: "中",
    chiko_sensor_high: "高",
    notAES: "没有找到新的aes",
    aes_not_equal: "你没有权限",
    unlock_lock_battery: "开电池锁",
    lock_lock_battery: "关电池锁",
    ulock_wheel: "开轮毂锁",
    lock_wheel: "关轮毂锁",
    set_userid: "写用户ID",
    get_userid: "读用户ID"
};

module.exports = {
    Fetch_language_lib: function() {
        return "zh_CN" == e.globalData.language ? n : o;
    }
};