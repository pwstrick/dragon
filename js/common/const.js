/**
 * 常量与正则
 */
;(function (global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory(global);
    } else {
        factory(global);
    }
})(typeof window !== "undefined" ? window : this, function (global) {
    var common = {};

    /**
     * 正则
     */
    common.regex = {
        mobile: /^1[0-9]{10}$/,//手机号码
        chinese: /^[\u4E00-\u9FA5]+$/, //全部是中文
        card: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/, //简单的身份证
        email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, //邮箱
        digits: /^\d+$/ //整数
    };
    return global.common = common;
});