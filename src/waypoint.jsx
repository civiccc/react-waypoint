const React = require('react');

const PropTypes = React.PropTypes;

/**
 * Calls a function when you scroll to the element.
 */
const Waypoint = React.createClass({
  propTypes: {
    onEnter: PropTypes.func,
    onLeave: PropTypes.func,
    // threshold is percentage of the height of the visible part of the
    // scrollable parent (e.g. 0.1)
    threshold: PropTypes.number,
  },

  _wasVisible: false,

  /**
   * @return {Object}
   */
  getDefaultProps: function() {
    return {
      threshold: 0,
      onEnter: function() {},
      onLeave: function() {},
    };
  },

  componentDidMount: function() {
    this.scrollableParent = this._findScrollableParent();
    this.scrollableParent.addEventListener('scroll', this._handleScroll);
    window.addEventListener('resize', this._handleScroll);
    this._handleScroll();
  },

  componentDidUpdate: function() {
    // The element may have moved.
    this._handleScroll();
  },

  componentWillUnmount: function() {
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
  _findScrollableParent: function() {
    let node = this.getDOMNode();

    while (node.parentNode) {
      node = node.parentNode;

      if (node === document) {
        // This particular node does not have a computed style.
        continue;
      }

      const style = window.getComputedStyle(node);
      const overflowY = style.getPropertyValue('overflow-y') ||
        style.getPropertyValue('overflow');

      if (overflowY === 'auto' || overflowY === 'scroll') {
        return node;
      }
    }

    // A scrollable parent element was not found, which means that we need to do
    // stuff on window.
    return window;
  },

  /**
   * @param {Object} event the native scroll event coming from the scrollable
   *   parent, or resize event coming from the window. Will be undefined if
   *   called by a React lifecyle method
   */
  _handleScroll: function(event) {
    const isVisible = this._isVisible();

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
  _distanceToTopOfScrollableParent: function(node) {
    if (this.scrollableParent !== window && !node.offsetParent) {
      throw new Error(
        'The scrollable parent of Waypoint needs to have positioning to ' +
        'properly determine position of Waypoint (e.g. `position: relative;`)'
      );
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
  _isVisible: function() {
    const waypointTop = this._distanceToTopOfScrollableParent(this.getDOMNode());
    let contextHeight, contextScrollTop;

    if (this.scrollableParent === window) {
      contextHeight = window.innerHeight;
      contextScrollTop = window.pageYOffset;
    } else {
      contextHeight = this.scrollableParent.offsetHeight;
      contextScrollTop = this.scrollableParent.scrollTop;
    }

    const thresholdPx = contextHeight * this.props.threshold;

    const isAboveBottom = contextScrollTop + contextHeight >= waypointTop - thresholdPx;
    const isBelowTop    = contextScrollTop <= waypointTop + thresholdPx;

    return isAboveBottom && isBelowTop;
  },

  /**
   * @return {Object}
   */
  render: function() {
    // We need an element that we can locate in the DOM to determine where it is
    // rendered relative to the top of its context.
    return (<span style={{fontSize: 0}} />);
  }
});

module.exports = Waypoint;
