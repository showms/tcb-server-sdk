//引入时间格式化模块
const moment = require('moment');
const YYYY_MM_DD_HH_MM_SS = 'YYYY-MM-DD HH:mm:ss';
const YYYY_MM_DD = 'YYYY-MM-DD';

const currentDateTime = function () {
    return moment().utcOffset(480).format(YYYY_MM_DD_HH_MM_SS);
};

const currentDate = function () {
    return moment().utcOffset(480).format(YYYY_MM_DD);
};

const formatDateTime = function (dateTime) {
    return moment(dateTime).format(YYYY_MM_DD_HH_MM_SS);
};

const formatDate = function (date) {
    return moment(date).format(YYYY_MM_DD);
};

const convert = function (data) {
    return moment(data);
};

module.exports = {currentDateTime, currentDate, formatDateTime, formatDate, convert};