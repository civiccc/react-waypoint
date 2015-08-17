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
    // scrollable ancestor (e.g. 0.1)
    threshold: PropTypes.number
  },

  /**
   * @return {Object}
   */
  getDefaultProps: function getDefaultProps() {
    return {
      threshold: 0,
      onEnter: function onEnter() {},
      onLeave: function onLeave() {}
    };
  },

  componentDidMount: function componentDidMount() {
    this.scrollableAncestor = this._findScrollableAncestor();
    this.scrollableAncestor.addEventListener('scroll', this._handleScroll);
    window.addEventListener('resize', this._handleScroll);
    this._handleScroll();
  },

  componentDidUpdate: function componentDidUpdate() {
    // The element may have moved.
    this._handleScroll();
  },

  componentWillUnmount: function componentWillUnmount() {
    if (this.scrollableAncestor) {
      // At the time of unmounting, the scrollable ancestor might no longer
      // exist. Guarding against this prevents the following error:
      //
      //   Cannot read property 'removeEventListener' of undefined
      this.scrollableAncestor.removeEventListener('scroll', this._handleScroll);
    }
    window.removeEventListener('resize', this._handleScroll);
  },

  _wasVisible: false,

  /**
   * Traverses up the DOM to find an ancestor container which has an overflow
   * style that allows for scrolling.
   *
   * @return {Object} the closest ancestor element with an overflow style that
   *   allows for scrolling. If none is found, the `window` object is returned
   *   as a fallback.
   */
  _findScrollableAncestor: function _findScrollableAncestor() {
    var node = this.getDOMNode();

    while (node.parentNode) {
      node = node.parentNode;

      if (node === document) {
        // This particular node does not have a computed style.
        continue;
      }

      var style = window.getComputedStyle(node);
      var overflowY = style.getPropertyValue('overflow-y') || style.getPropertyValue('overflow');

      if (overflowY === 'auto' || overflowY === 'scroll') {
        return node;
      }
    }

    // A scrollable ancestor element was not found, which means that we need to
    // do stuff on window.
    return window;
  },

  /**
   * @param {Object} event the native scroll event coming from the scrollable
   *   ancestor, or resize event coming from the window. Will be undefined if
   *   called by a React lifecyle method
   */
  _handleScroll: function _handleScroll(event) {
    var isVisible = this._isVisible();

    if (this._wasVisible === isVisible) {
      // No change since last trigger
      return;
    }

    if (isVisible) {
      this.props.onEnter.call(this, event);
    } else {
      this.props.onLeave.call(this, event);
    }

    this._wasVisible = isVisible;
  },

  /**
   * @param {Object} node
   * @return {Number}
   */
  _distanceToTopOfScrollableAncestor: function _distanceToTopOfScrollableAncestor(node) {
    if (this.scrollableAncestor !== window && !node.offsetParent) {
      throw new Error('The scrollable ancestor of Waypoint needs to have positioning to ' + 'properly determine position of Waypoint (e.g. `position: relative;`)');
    }

    if (node.offsetParent === this.scrollableAncestor || !node.offsetParent) {
      return node.offsetTop;
    } else {
      return node.offsetTop + this._distanceToTopOfScrollableAncestor(node.offsetParent);
    }
  },

  /**
   * @return {boolean} true if scrolled down almost to the end of the scrollable
   *   ancestor element.
   */
  _isVisible: function _isVisible() {
    var waypointTop = this._distanceToTopOfScrollableAncestor(this.getDOMNode());
    var contextHeight = undefined;
    var contextScrollTop = undefined;

    if (this.scrollableAncestor === window) {
      contextHeight = window.innerHeight;
      contextScrollTop = window.pageYOffset;
    } else {
      contextHeight = this.scrollableAncestor.offsetHeight;
      contextScrollTop = this.scrollableAncestor.scrollTop;
    }

    var thresholdPx = contextHeight * this.props.threshold;

    var contextBottom = contextScrollTop + contextHeight;
    var isAboveBottom = contextBottom >= waypointTop - thresholdPx;
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
