import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

export const POSITIONS = {
  above: 'above',
  inside: 'inside',
  below: 'below',
  invisible: 'invisible',
};

export function getWindow() {
  return typeof window !== 'undefined';
}

const propTypes = {
  debug: PropTypes.bool,
  // threshold is percentage of the height of the visible part of the
  // scrollable ancestor (e.g. 0.1)
  threshold: PropTypes.number,
  scrollableAncestor: PropTypes.any,
  throttleHandler: PropTypes.func
};

const defaultProps = {
  threshold: 0,
  throttleHandler(handler) {
    return handler;
  }
};

function debugLog() {
  console.log(arguments); // eslint-disable-line no-console
}

/**
 * @param {function} Component
 * Calls a function when you scroll to the element.
 * @return {function}
 */
export function waypoint(Component) {
  class _waypoint extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        scrolled: null,
        scrollableAncestor: null
      };
    }

    componentDidMount() {
      if (!getWindow()) {
        return;
      }

      this._handleScroll =
        this.props.throttleHandler(this._handleScroll.bind(this));
      this.scrollableAncestor = this.state.scrollableAncestor =
        this._findScrollableAncestor();
      if (this.props.debug) {
        debugLog('scrollableAncestor', this.scrollableAncestor);
      }
      this.scrollableAncestor.addEventListener('scroll', this._handleScroll);
      window.addEventListener('resize', this._handleScroll);
      this._handleScroll(null);
    }

    componentDidUpdate(prevProps, prevState) {
      if (!getWindow()) {
        return;
      }

      if (prevState.scrolled === this.state.scrolled) {
        // The element may have moved.
        this._handleScroll(null);
      }
    }

    componentWillUnmount() {
      if (!getWindow()) {
        return;
      }

      if (this.scrollableAncestor) {
        // At the time of unmounting, the scrollable ancestor might no longer
        // exist. Guarding against this prevents the following error:
        //
        //   Cannot read property 'removeEventListener' of undefined
        this.scrollableAncestor
          .removeEventListener('scroll', this._handleScroll);
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

      let node = ReactDOM.findDOMNode(this);

      while (node.parentNode) {
        node = node.parentNode;

        if (node === document) {
          // This particular node does not have a computed style.
          continue;
        }

        if (node === document.documentElement) {
          // This particular node does not have a scroll bar,
          // it uses the window.
          continue;
        }

        const style = window.getComputedStyle(node);
        const overflowY = style.getPropertyValue('overflow-y') ||
          style.getPropertyValue('overflow');

        if (overflowY === 'auto' || overflowY === 'scroll') {
          return node;
        }
      }

      // A scrollable ancestor element was not found,
      // which means that we need to do stuff on window.
      return window;
    }

    /**
     * @param {Object} event the native scroll event coming from the scrollable
     *   ancestor, or resize event coming from the window. Will be undefined if
     *   called by a React lifecyle method
     */
    _handleScroll(event) {
      const currentPosition = this._currentPosition();
      const previousPosition = this._previousPosition || null;
      if (this.props.debug) {
        debugLog('currentPosition', currentPosition);
        debugLog('previousPosition', previousPosition);
      }

      // Save previous position as early as possible to prevent cycles
      this._previousPosition = currentPosition;

      const scrolled = {
        currentPosition,
        previousPosition,
        event,
      };

      this.setState({ scrolled });
    }

    /**
     * @return {string} The current position of the waypoint in relation to the
     *   visible portion of the scrollable parent. One of `POSITIONS.above`,
     *   `POSITIONS.below`, or `POSITIONS.inside`.
     */
    _currentPosition() {
      const waypointTop =
        ReactDOM.findDOMNode(this).getBoundingClientRect().top;
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
      if (this.props.debug) {
        debugLog('waypoint top', waypointTop);
        debugLog('scrollableAncestor height', contextHeight);
        debugLog('scrollableAncestor scrollTop', contextScrollTop);
      }
      const thresholdPx = contextHeight * this.props.threshold;
      const contextBottom = contextScrollTop + contextHeight;

      if (contextHeight === 0) {
        return POSITIONS.invisible;
      }

      if (contextScrollTop <= waypointTop + thresholdPx &&
          waypointTop - thresholdPx <= contextBottom) {
        return POSITIONS.inside;
      }

      if (contextBottom < waypointTop - thresholdPx) {
        return POSITIONS.below;
      }

      if (waypointTop + thresholdPx < contextScrollTop) {
        return POSITIONS.above;
      }

      return POSITIONS.invisible;
    }

    /**
     * @return {Object}
     */
    render() {
      return (<Component
        {...this.props}
        _scrolled={this.state.scrolled}
        _scrollableAncestor={this.state.scrollableAncestor}
      />);
    }
  }
  _waypoint.propTypes = propTypes;
  _waypoint.defaultProps = defaultProps;
  _waypoint.displayName = '_waypoint';

  return _waypoint;
}
