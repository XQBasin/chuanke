'use strict';

var _objectUtil = require('./object.util.js');

var _objectUtil2 = _interopRequireDefault(_objectUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formatNumber = function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

var formatTime = function formatTime(date) {
  return formatDate(date) + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].map(formatNumber).join(':');
};

var formatDate = function formatDate(date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(formatNumber).join('-');
};

var $init = function $init(page) {
  page.$data = _objectUtil2.default.$copy(page.data, true);
};

var $digest = function $digest(page) {
  var data = page.data;
  var $data = page.$data;
  var ready2set = {};

  for (var k in data) {
    if (!_objectUtil2.default.$isEqual(data[k], $data[k])) {
      ready2set[k] = data[k];
      $data[k] = _objectUtil2.default.$copy(data[k], true);
    }
  }

  if (Object.keys(ready2set).length) {
    page.setData(ready2set);
  }
};

module.exports = {
  formatDate: formatDate,
  formatTime: formatTime,
  $init: $init,
  $digest: $digest
};