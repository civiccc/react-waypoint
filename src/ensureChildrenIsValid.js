import isDOMElement from './isDOMElement';
import isFunction from './isFunction';

/**
 * Raise an error if "children" isn't a single DOM Element or a function
 *
 * @param {React.element|null} children
 * @return {undefined}
 */
export default function ensureChildrenIsValid(children) {
  if (children && !isFunction(children) && !isDOMElement(children)) {
    throw new Error(
      'You must wrap any Component Elements passed to Waypoint in a DOM Element (eg; a <div>)' +
      'or in a Render Callback'
    );
  }
}
