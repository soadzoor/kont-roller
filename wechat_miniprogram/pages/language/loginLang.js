var e = getApp(), t = {
    title: "Picasau register",
    username: "username",
    usernameholder: "enter one user name",
    pass: "password",
    passholder: "enter one password",
    logon: "Logon",
    alertaccount: "Please enter your account and password",
    confiem: "OK",
    addSuccess: "Create success",
    addError: "Create fail",
    existUser: "Existing account name",
    loginFrist: "Account information has changed,Please close the WeChat and reopen it",
    authTitle: "Authorize system",
    autnLogin: "Checking",
    notCount: "Authorization has expired, please re-authorize administrator",
    authSuccess: "Authorization succeeded! Once logged in, it can be used",
    countOver: "Authorization expires, please re-authorize",
    authEror: "Privilege grant failed",
    accError: "Error in account or password",
    myself: "You is an administrator",
    bleAuth: "Bluetooth Authorization",
    authBtn: "Authorization",
    bleBtn: "Bluetooth",
    authOK: "Success",
    authNO: "Error",
    notChinese: "",
    netUnlock: "Network",
    bleUnlock: "Bluetooth",
    version: "version",
    regit: "Register account",
    login: "Login"
}, o = {
    title: "注册系统",
    username: "账 号",
    usernameholder: "输入账号",
    pass: "密 码",
    passholder: "输入密码",
    logon: "注册",
    alertaccount: "请输入账号和密码",
    confiem: "确定",
    addSuccess: "注册成功！",
    addError: "注册失败！已关闭注册！",
    existUser: "该账户已存在",
    loginFrist: "账号信息已变动，请关闭微信再使用此程序",
    authTitle: "授权系统",
    autnLogin: "验证",
    notCount: "授权已过期,请管理员重新授权",
    authSuccess: "授权成功！即将进去登录界面登录",
    countOver: "授权次数已用完，请管理员重新授权",
    authEror: "授权失败，请联系大创技术人员",
    accError: "账号或密码错误",
    myself: "你已经是管理员，不需要授权",
    bleAuth: "蓝牙授权",
    authBtn: "授权",
    bleBtn: "蓝牙开锁",
    authOK: "授权成功",
    authNO: "授权失败",
    notChinese: "用户名请输入字母+数字，不要有中文汉字",
    netUnlock: "网络开锁",
    bleUnlock: "蓝牙开锁",
    version: "版本号",
    regit: "注册账号",
    login: "登录"
};

module.exports = {
    Fetch_language_lib: function() {
        return "zh_CN" == e.globalData.language ? o : t;
    }
};