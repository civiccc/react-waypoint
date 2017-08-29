import React from 'react';

export const errorMessage =
  '<Waypoint> expected to receive a function or a single React element child.\n\n' +
  'See /* TODO: shortlink to Children section */ for more info.';

/**
 * Raise an error if "children" is not a function or if more that one child was provided
 *
 * @param {?(React.element|Function)} children
 * @return {undefined}
 */
export default function ensureChildrenIsValid(children) {
  if (children && typeof children !== 'function') {
    try {
      React.Children.only(children);
    } catch (e) {
      throw new Error(errorMessage);
    }
  }
}
