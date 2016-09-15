import React, { PropTypes } from 'react';

const POSITIONS = {
  above: 'above',
  inside: 'inside',
  below: 'below',
  invisible: 'invisible',
};

const propTypes = {
  debug: PropTypes.bool,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  onPositionChange: PropTypes.func,
  fireOnRapidScroll: PropTypes.bool,
  scrollableAncestor: PropTypes.any,
  throttleHandler: PropTypes.func,
  // `topOffset` can either be a number, in which case its a distance from the
  // top of the container in pixels, or a string value. Valid string values are
  // of the form "20px", which is parsed as pixels, or "20%", which is parsed
  // as a percentage of the height of the containing element.
  // For instance, if you pass "-20%", and the containing element is 100px tall,
  // then the waypoint will be triggered when it has been scrolled 20px beyond
  // the top of the containing element.
  topOffset: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  // `bottomOffset` is like `topOffset`, but for the bottom of the container.
  bottomOffset: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

const defaultProps = {
  topOffset: '0px',
  bottomOffset: '0px',
  onEnter() {},
  onLeave() {},
  onPositionChange() {},
  fireOnRapidScroll: true,
  throttleHandler(handler) {
    return handler;
  }
};

function debugLog() {
  console.log(arguments); // eslint-disable-line no-console
}

/**
 * Calls a function when you scroll to the element.
 */
export default class Waypoint extends React.Component {
  constructor(props) {
    super(props);

    this.refElement = (e) => this._ref = e;
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
    this._handleScroll =
      this.props.throttleHandler(this._handleScroll.bind(this));
    this.scrollableAncestor = this._findScrollableAncestor();
    if (this.props.debug) {
      debugLog('scrollableAncestor', this.scrollableAncestor);
    }
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

    let node = this._ref;

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
    if (!this._ref) {
      // There's a chance we end up here after the component has been unmounted.
      return;
    }
    const bounds = this._getBounds();
    const currentPosition = this._currentPosition(bounds);
    const previousPosition = this._previousPosition || null;
    if (this.props.debug) {
      debugLog('currentPosition', currentPosition);
      debugLog('previousPosition', previousPosition);
    }

    // Save previous position as early as possible to prevent cycles
    this._previousPosition = currentPosition;

    if (previousPosition === currentPosition) {
      // No change since last trigger
      return;
    }

    const callbackArg = {
      currentPosition,
      previousPosition,
      event,
      waypointTop: bounds.waypointTop,
      viewportTop: bounds.viewportTop,
      viewportBottom: bounds.viewportBottom,
    };
    this.props.onPositionChange.call(this, callbackArg);

    if (currentPosition === POSITIONS.inside) {
      this.props.onEnter.call(this, callbackArg);
    } else if (previousPosition === POSITIONS.inside) {
      this.props.onLeave.call(this, callbackArg);
    }

    const isRapidScrollDown = previousPosition === POSITIONS.below &&
      currentPosition === POSITIONS.above;
    const isRapidScrollUp =   previousPosition === POSITIONS.above &&
      currentPosition === POSITIONS.below;
    if (this.props.fireOnRapidScroll &&
        (isRapidScrollDown || isRapidScrollUp)) {
      // If the scroll event isn't fired often enough to occur while the
      // waypoint was visible, we trigger both callbacks anyway.
      this.props.onEnter.call(this, {
        currentPosition: POSITIONS.inside,
        previousPosition,
        event,
        waypointTop: bounds.waypointTop,
        viewportTop: bounds.viewportTop,
        viewportBottom: bounds.viewportBottom,
      });
      this.props.onLeave.call(this, {
        currentPosition,
        previousPosition: POSITIONS.inside,
        event,
        waypointTop: bounds.waypointTop,
        viewportTop: bounds.viewportTop,
        viewportBottom: bounds.viewportBottom,
      });
    }
  }

  /**
   * @param {string|number} offset
   * @param {number} contextHeight
   * @return {number} A number representing `offset` converted into pixels.
   */
  _computeOffsetPixels(offset, contextHeight) {
    const pixelOffset = this._parseOffsetAsPixels(offset);
    if (typeof pixelOffset === 'number') {
      return pixelOffset;
    }

    const percentOffset = this._parseOffsetAsPercentage(offset);
    if (typeof percentOffset === 'number') {
      return percentOffset * contextHeight;
    }
  }

  /**
   * Attempts to parse the offset provided as a prop as a pixel value. If
   * parsing fails, then `undefined` is returned. Three examples of values that
   * will be successfully parsed are:
   * `20`
   * "20px"
   * "20"
   *
   * @param {string|number} str A string of the form "{number}" or "{number}px",
   *   or just a number.
   * @return {number|undefined} The numeric version of `str`. Undefined if `str`
   *   was neither a number nor string ending in "px".
   */
  _parseOffsetAsPixels(str) {
    if (!isNaN(parseFloat(str)) && isFinite(str)) {
      return parseFloat(str);
    } else if (str.slice(-2) === 'px') {
      return parseFloat(str.slice(0, -2));
    }
  }

  /**
   * Attempts to parse the offset provided as a prop as a percentage. For
   * instance, if the component has been provided with the string "20%" as
   * a value of one of the offset props. If the value matches, then it returns
   * a numeric version of the prop. For instance, "20%" would become `0.2`.
   * If `str` isn't a percentage, then `undefined` will be returned.
   *
   * @param {string} str The value of an offset prop to be converted to a
   *   number.
   * @return {number|undefined} The numeric version of `str`. Undefined if `str`
   *   was not a percentage.
   */
  _parseOffsetAsPercentage(str) {
    if (str.slice(-1) === '%') {
      return parseFloat(str.slice(0, -1)) / 100;
    }
  }

  _getBounds() {
    const waypointTop = this._ref.getBoundingClientRect().top;
    let contextHeight;
    let contextScrollTop;
    if (this.scrollableAncestor === window) {
      contextHeight = window.innerHeight;
      contextScrollTop = 0;
    } else {
      contextHeight = this.scrollableAncestor.offsetHeight;
      contextScrollTop = this.scrollableAncestor
        .getBoundingClientRect().top;
    }
    if (this.props.debug) {
      debugLog('waypoint top', waypointTop);
      debugLog('scrollableAncestor height', contextHeight);
      debugLog('scrollableAncestor scrollTop', contextScrollTop);
    }

    const { bottomOffset, topOffset } = this.props;
    const topOffsetPx = this._computeOffsetPixels(topOffset, contextHeight);
    const bottomOffsetPx = this._computeOffsetPixels(bottomOffset, contextHeight);
    const contextBottom = contextScrollTop + contextHeight;

    return {
      waypointTop,
      viewportTop: contextScrollTop + topOffsetPx,
      viewportBottom: contextBottom - bottomOffsetPx,
    };
  }

  /**
   * @param {object} bounds An object with bounds data for the waypoint and
   *   scrollable parent
   * @return {string} The current position of the waypoint in relation to the
   *   visible portion of the scrollable parent. One of `POSITIONS.above`,
   *   `POSITIONS.below`, or `POSITIONS.inside`.
   */
  _currentPosition(bounds) {
    if (bounds.viewportBottom - bounds.viewportTop === 0) {
      return Waypoint.invisible;
    }

    if (bounds.viewportTop <= bounds.waypointTop &&
        bounds.waypointTop <= bounds.viewportBottom) {
      return Waypoint.inside;
    }

    if (bounds.viewportBottom < bounds.waypointTop) {
      return Waypoint.below;
    }

    if (bounds.waypointTop < bounds.viewportTop) {
      return Waypoint.above;
    }

    return Waypoint.invisible;
  }

  /**
   * @return {Object}
   */
  render() {
    // We need an element that we can locate in the DOM to determine where it is
    // rendered relative to the top of its context.
    return <span ref={this.refElement} style={{fontSize: 0}} />;
  }
}

Waypoint.propTypes = propTypes;
Waypoint.above = POSITIONS.above;
Waypoint.below = POSITIONS.below;
Waypoint.inside = POSITIONS.inside;
Waypoint.invisible = POSITIONS.invisible;
Waypoint.getWindow = () => {
  if (typeof window !== 'undefined') {
    return window;
  }
};
Waypoint.defaultProps = defaultProps;
Waypoint.displayName = 'Waypoint';
