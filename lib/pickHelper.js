/**
 * 指定key提取json
 * @param params
 * @param keys
 */
const pick = function (params, keys) {
    const result = {};
    const copy = Object.assign({}, params);
    keys.forEach(key => {
        const keyArr = key.split(":");
        if (keyArr.length === 1) {
            keyArr.push(key);
        }
        const item = {};
        item[keyArr[1]] = copy[keyArr[0]];
        Object.assign(result, item);
    });
    return result;
};

module.exports = {pick};