import React, { PropTypes } from 'react';
import waypoint, { POSITIONS } from './waypoint-hoc';

const propTypes = {
  _scrolled: PropTypes.object,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  onPositionChange: PropTypes.func,
  fireOnRapidScroll: PropTypes.bool
};

const defaultProps = {
  _scrolled: {},
  onEnter() {},
  onLeave() {},
  onPositionChange() {},
  fireOnRapidScroll: true
};

/**
 * Calls a function when you scroll to the element.
 */
class Waypoint extends React.Component {
  componentWillReceiveProps(nextProps) {
    const {
      currentPosition,
      previousPosition,
      event
    } = nextProps._scrolled;

    if (previousPosition === currentPosition) {
      // No change since last trigger
      return;
    }

    const callbackArg = {
      currentPosition,
      previousPosition,
      event
    };

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

  render() {
    return <span style={{fontSize: 0}}/>;
  }
}

Waypoint.propTypes = propTypes;
Waypoint.defaultProps = defaultProps;

export default waypoint(Waypoint);
