'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _waypointHoc = require('./waypoint-hoc');

var _waypointHoc2 = _interopRequireDefault(_waypointHoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Calls a function when you scroll to the element.
 */
exports.default = (0, _waypointHoc2.default)(function Waypoint() {
  return _react2.default.createElement('span', { style: { fontSize: 0 } });
});
module.exports = exports['default'];