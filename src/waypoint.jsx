import React from 'react';
import waypoint from './waypoint-hoc';

/**
 * Calls a function when you scroll to the element.
 */
export default waypoint(
  class Waypoint extends React.Component {
    shouldComponentUpdate(nextProps) {
      const { currentPosition, previousPosition } = nextProps._scrolled;
      return currentPosition !== previousPosition;
    }

    render() {
      return <span style={{fontSize: 0}}/>;
    }
  });
