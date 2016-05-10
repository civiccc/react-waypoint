import React from 'react';
import waypoint from './waypoint-hoc';

/**
 * Calls a function when you scroll to the element.
 */
export default waypoint(function Waypoint() {
  return <span style={{fontSize: 0}}/>;
});
