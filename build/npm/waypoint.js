'use strict';

var React = require('react');

var PropTypes = React.PropTypes;

/**
 * Calls a function when you scroll to the element.
 */
var Waypoint = React.createClass({
  displayName: 'Waypoint',

  propTypes: {
    onEnter: PropTypes.func,
    onLeave: PropTypes.func,
    // threshold is percentage of the height of the visible part of the
    // scrollable parent (e.g. 0.1)
    threshold: PropTypes.number },

  _wasVisible: false,

  /**
   * @return {Object}
   */
  getDefaultProps: function getDefaultProps() {
    return {
      threshold: 0,
      onEnter: function onEnter() {},
      onLeave: function onLeave() {} };
  },

  componentDidMount: function componentDidMount() {
    this.scrollableParent = this._findScrollableParent();
    this.scrollableParent.addEventListener('scroll', this._handleScroll);
    window.addEventListener('resize', this._handleScroll);
    this._handleScroll();
  },

  componentDidUpdate: function componentDidUpdate() {
    // The element may have moved.
    this._handleScroll();
  },

  componentWillUnmount: function componentWillUnmount() {
    if (this.scrollableParent) {
      // At the time of unmounting, the scrollable parent might no longer exist.
      // Guarding against this prevents the following error:
      //
      //   Cannot read property 'removeEventListener' of undefined
      this.scrollableParent.removeEventListener('scroll', this._handleScroll);
      window.removeEventListener('resize', this._handleScroll);
    }
  },

  /**
   * Traverses up the DOM to find a parent container which has an overflow style
   * that allows for scrolling.
   *
   * @return {Object} the closest parent element with an overflow style that
   *   allows for scrolling. If none is found, the `window` object is returned
   *   as a fallback.
   */
  _findScrollableParent: function _findScrollableParent() {
    var node = this.getDOMNode();

    while (node.parentNode) {
      node = node.parentNode;

      if (node === document) {
        // This particular node does not have a computed style.
        continue;
      }

      var _style = window.getComputedStyle(node);
      var overflowY = _style.getPropertyValue('overflow-y') || _style.getPropertyValue('overflow');

      if (overflowY === 'auto' || overflowY === 'scroll') {
        return node;
      }
    }

    // A scrollable parent element was not found, which means that we need to do
    // stuff on window.
    return window;
  },

  _handleScroll: function _handleScroll() {
    var isVisible = this._isVisible();

    if (this._wasVisible === isVisible) {
      // No change since last trigger
      return;
    }

    if (isVisible) {
      this.props.onEnter();
    } else {
      this.props.onLeave();
    }

    this._wasVisible = isVisible;
  },

  /**
   * @param {Object} node
   * @return {Number}
   */
  _distanceToTopOfScrollableParent: function _distanceToTopOfScrollableParent(node) {
    if (this.scrollableParent !== window && !node.offsetParent) {
      throw new Error('The scrollable parent of Waypoint needs to have positioning to ' + 'properly determine position of Waypoint (e.g. `position: relative;`)');
    }

    if (node.offsetParent === this.scrollableParent || !node.offsetParent) {
      return node.offsetTop;
    } else {
      return node.offsetTop + this._distanceToTopOfScrollableParent(node.offsetParent);
    }
  },

  /**
   * @return {boolean} true if scrolled down almost to the end of the scrollable
   *   parent element.
   */
  _isVisible: function _isVisible() {
    var waypointTop = this._distanceToTopOfScrollableParent(this.getDOMNode());
    var contextHeight = undefined,
        contextScrollTop = undefined;

    if (this.scrollableParent === window) {
      contextHeight = window.innerHeight;
      contextScrollTop = window.pageYOffset;
    } else {
      contextHeight = this.scrollableParent.offsetHeight;
      contextScrollTop = this.scrollableParent.scrollTop;
    }

    var thresholdPx = contextHeight * this.props.threshold;

    var isAboveBottom = contextScrollTop + contextHeight >= waypointTop - thresholdPx;
    var isBelowTop = contextScrollTop <= waypointTop + thresholdPx;

    return isAboveBottom && isBelowTop;
  },

  /**
   * @return {Object}
   */
  render: function render() {
    // We need an element that we can locate in the DOM to determine where it is
    // rendered relative to the top of its context.
    return React.createElement('span', { style: { fontSize: 0 } });
  }
});

module.exports = Waypoint;
