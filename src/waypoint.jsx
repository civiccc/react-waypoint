const React = require('react');
const ReactDOM = require('react-dom');

const { PropTypes } = React;

const POSITIONS = {
  above: 'above',
  inside: 'inside',
  below: 'below',
};

/**
 * Calls a function when you scroll to the element.
 */
const Waypoint = React.createClass({
  propTypes: {
    onEnter: PropTypes.func,
    onLeave: PropTypes.func,
    // threshold is percentage of the height of the visible part of the
    // scrollable ancestor (e.g. 0.1)
    threshold: PropTypes.number,
    className: PropTypes.string
  },

  /**
   * @return {Object}
   */
  getDefaultProps() {
    return {
      threshold: 0,
      onEnter() {},
      onLeave() {},
      className: null
    };
  },

  componentDidMount() {
    this.scrollableAncestor = this._findScrollableAncestor();
    this.scrollableAncestor.addEventListener('scroll', this._handleScroll);
    window.addEventListener('resize', this._handleScroll);
    this._handleScroll();
  },

  componentDidUpdate() {
    // The element may have moved.
    this._handleScroll();
  },

  componentWillUnmount() {
    if (this.scrollableAncestor) {
      // At the time of unmounting, the scrollable ancestor might no longer
      // exist. Guarding against this prevents the following error:
      //
      //   Cannot read property 'removeEventListener' of undefined
      this.scrollableAncestor.removeEventListener('scroll', this._handleScroll);
    }
    window.removeEventListener('resize', this._handleScroll);
  },

  /**
   * Traverses up the DOM to find an ancestor container which has an overflow
   * style that allows for scrolling.
   *
   * @return {Object} the closest ancestor element with an overflow style that
   *   allows for scrolling. If none is found, the `window` object is returned
   *   as a fallback.
   */
  _findScrollableAncestor() {
    let node = ReactDOM.findDOMNode(this);

    while (node.parentNode) {
      node = node.parentNode;

      if (node === document) {
        // This particular node does not have a computed style.
        continue;
      }

      if (node === document.documentElement) {
        // This particular node does not have a scroll bar, it uses the window.
        continue;
      }

      const style = window.getComputedStyle(node);
      const overflowY = style.getPropertyValue('overflow-y') ||
        style.getPropertyValue('overflow');

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
  _handleScroll(event) {
    const currentPosition = this._currentPosition();
    const previousPosition = this._previousPosition;

    // Save previous position as early as possible to prevent cycles
    this._previousPosition = currentPosition;

    if (previousPosition === currentPosition) {
      // No change since last trigger
      return;
    }

    if (currentPosition === POSITIONS.inside) {
      this.props.onEnter.call(this, event);
    } else if (previousPosition === POSITIONS.inside) {
      this.props.onLeave.call(this, event);
    }

    const isRapidScrollDown = previousPosition === POSITIONS.below &&
                              currentPosition === POSITIONS.above;
    const isRapidScrollUp =   previousPosition === POSITIONS.above &&
                              currentPosition === POSITIONS.below;
    if (isRapidScrollDown || isRapidScrollUp) {
      // If the scroll event isn't fired often enough to occur while the
      // waypoint was visible, we trigger both callbacks anyway.
      this.props.onEnter.call(this, event);
      this.props.onLeave.call(this, event);
    }
  },

  /**
   * @param {Object} node
   * @return {Number}
   */
  _distanceToTopOfScrollableAncestor(node) {
    if (this.scrollableAncestor !== window && !node.offsetParent) {
      throw new Error(
        'The scrollable ancestor of Waypoint needs to have positioning to ' +
        'properly determine position of Waypoint (e.g. `position: relative;`)'
      );
    }

    if (node.offsetParent === this.scrollableAncestor || !node.offsetParent) {
      return node.offsetTop;
    } else {
      return node.offsetTop +
        this._distanceToTopOfScrollableAncestor(node.offsetParent);
    }
  },

  /**
   * @return {boolean} true if scrolled down almost to the end of the scrollable
   *   ancestor element.
   */
  _currentPosition() {
    const waypointTop =
      this._distanceToTopOfScrollableAncestor(ReactDOM.findDOMNode(this));
    let contextHeight;
    let contextScrollTop;

    if (this.scrollableAncestor === window) {
      contextHeight = window.innerHeight;
      contextScrollTop = window.pageYOffset;
    } else {
      contextHeight = this.scrollableAncestor.offsetHeight;
      contextScrollTop = this.scrollableAncestor.scrollTop;
    }

    const thresholdPx = contextHeight * this.props.threshold;

    const isBelowTop = contextScrollTop <= waypointTop + thresholdPx;
    if (!isBelowTop) {
      return POSITIONS.above;
    }

    const contextBottom = contextScrollTop + contextHeight;
    const isAboveBottom = contextBottom >= waypointTop - thresholdPx;
    if (!isAboveBottom) {
      return POSITIONS.below;
    }

    return POSITIONS.inside;
  },

  /**
   * @return {Object}
   */
  render() {
    // We need an element that we can locate in the DOM to determine where it is
    // rendered relative to the top of its context.
    return <span style={{fontSize: 0, className}} />;
  }
});

module.exports = Waypoint;
