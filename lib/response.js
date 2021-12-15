/**
 * 成功
 * @param data
 */
const success = function (data = {}) {
    return {msg: "操作成功", success: true, data};
};

/**
 * 失败
 * @param msg
 * @param data
 */
const fail = function (msg = "操作失败", data = {}) {
    return {msg, success: false, data};
};

module.exports = {success, fail};