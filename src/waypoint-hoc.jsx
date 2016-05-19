import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

const POSITIONS = {
  above: 'above',
  inside: 'inside',
  below: 'below',
  invisible: 'invisible',
};

const propTypes = {
  // threshold is percentage of the height of the visible part of the
  // scrollable ancestor (e.g. 0.1)
  threshold: PropTypes.number,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  onPositionChange: PropTypes.func,
  fireOnRapidScroll: PropTypes.bool,
  scrollableAncestor: PropTypes.any,
};

const defaultProps = {
  threshold: 0,
  onEnter() {},
  onLeave() {},
  onPositionChange() {},
  fireOnRapidScroll: true
};

/**
 * Calls a function when you scroll to the element.
 */

const waypoint = Component => {
  const Waypoint = class _waypoint extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this._handleScroll = this._handleScroll.bind(this);
    }

    componentWillMount() {
      if (this.props.scrollableParent) { // eslint-disable-line react/prop-types
        throw new Error('The `scrollableParent` prop has changed name ' +
          'to `scrollableAncestor`.');
      }
    }

    componentDidMount() {
      if (!Waypoint.getWindow()) {
        return;
      }

      this._DOMNode = ReactDOM.findDOMNode(this);
      this.scrollableAncestor = this._findScrollableAncestor();
      this.scrollableAncestor.addEventListener('scroll', this._handleScroll);
      window.addEventListener('resize', this._handleScroll);
      this._handleScroll(null);
    }

    componentDidUpdate() {
      if (!Waypoint.getWindow()) {
        return;
      }

      // The element may have moved.
      this._handleScroll(null);
    }

    componentWillUnmount() {
      if (!Waypoint.getWindow()) {
        return;
      }

      if (this.scrollableAncestor) {
        // At the time of unmounting, the scrollable ancestor might no longer
        // exist. Guarding against this prevents the following error:
        //
        //   Cannot read property 'removeEventListener' of undefined
        this.scrollableAncestor.removeEventListener('scroll', this._handleScroll);
      }
      window.removeEventListener('resize', this._handleScroll);
    }

    /**
     * Traverses up the DOM to find an ancestor container which has an overflow
     * style that allows for scrolling.
     *
     * @return {Object} the closest ancestor element with an overflow style that
     *   allows for scrolling. If none is found, the `window` object is returned
     *   as a fallback.
     */
    _findScrollableAncestor() {
      if (this.props.scrollableAncestor) {
        return this.props.scrollableAncestor;
      }

      let node = this._DOMNode;

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
    }

    /**
     * @param {Object} event the native scroll event coming from the scrollable
     *   ancestor, or resize event coming from the window. Will be undefined if
     *   called by a React lifecyle method
     */
    _handleScroll(event) {
      const waypointTop = ReactDOM.findDOMNode(this).getBoundingClientRect().top;
      const { contextScrollTop, contextHeight } = this._scrollableAncestorHeightTop();
      const currentPosition = this._currentPosition(waypointTop, contextScrollTop, contextHeight);
      const previousPosition = this._previousPosition || null;

      // Save previous position as early as possible to prevent cycles
      this._previousPosition = currentPosition;

      const callbackArg = {
        waypointTop,
        contextScrollTop,
        contextHeight,
        currentPosition,
        previousPosition,
        event,
      };

      this.setState({ scrolled: callbackArg });

      if (previousPosition === currentPosition) {
        // No change since last trigger
        return;
      }

      this.props.onPositionChange.call(this, callbackArg);

      if (currentPosition === POSITIONS.inside) {
        this.props.onEnter.call(this, callbackArg);
      } else if (previousPosition === POSITIONS.inside) {
        this.props.onLeave.call(this, callbackArg);
      }

      const isRapidScrollDown = previousPosition === POSITIONS.below &&
        currentPosition === POSITIONS.above;
      const isRapidScrollUp = previousPosition === POSITIONS.above &&
        currentPosition === POSITIONS.below;
      if (this.props.fireOnRapidScroll &&
        (isRapidScrollDown || isRapidScrollUp)) {
        // If the scroll event isn't fired often enough to occur while the
        // waypoint was visible, we trigger both callbacks anyway.
        this.props.onEnter.call(this, {
          currentPosition: POSITIONS.inside,
          previousPosition,
          event,
        });
        this.props.onLeave.call(this, {
          currentPosition,
          previousPosition: POSITIONS.inside,
          event,
        });
      }
    }

    _scrollableAncestorHeightTop() {
      let contextHeight;
      let contextScrollTop;
      if (this.scrollableAncestor === window) {
        contextHeight = window.innerHeight;
        contextScrollTop = 0;
      } else {
        contextHeight = this.scrollableAncestor.offsetHeight;
        contextScrollTop = ReactDOM
          .findDOMNode(this.scrollableAncestor)
          .getBoundingClientRect().top;
      }
      return { contextScrollTop, contextHeight };
    }

    /**
     * @return {string} The current position of the waypoint in relation to the
     *   visible portion of the scrollable parent. One of `POSITIONS.above`,
     *   `POSITIONS.below`, or `POSITIONS.inside`.
     */
    _currentPosition(waypointTop, contextScrollTop, contextHeight) {

      const thresholdPx = contextHeight * this.props.threshold;
      const contextBottom = contextScrollTop + contextHeight;

      if (contextHeight === 0) {
        return Waypoint.invisible;
      }

      if (contextScrollTop <= waypointTop + thresholdPx &&
          waypointTop - thresholdPx <= contextBottom) {
        return Waypoint.inside;
      }

      if (contextBottom < waypointTop - thresholdPx) {
        return Waypoint.below;
      }

      if (waypointTop + thresholdPx < contextScrollTop) {
        return Waypoint.above;
      }

      return Waypoint.invisible;
    }

    /**
     * @return {Object}
     */
    render() {
      return <Component {...this.props} _scrolled={this.state.scrolled}/>;
    }
  }

  Waypoint.propTypes = propTypes;
  Waypoint.above = POSITIONS.above;
  Waypoint.below = POSITIONS.below;
  Waypoint.inside = POSITIONS.inside;
  Waypoint.invisible = POSITIONS.invisible;
  Waypoint.getWindow = () => typeof window !== 'undefined';
  Waypoint.defaultProps = defaultProps;

  return Waypoint;
}

export default waypoint;
