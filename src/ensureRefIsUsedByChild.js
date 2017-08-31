import isDOMElement from './isDOMElement';

export const errorMessage =
  '<Waypoint> needs a DOM element to compute boundaries. The child you passed is neither a ' +
  'DOM element (e.g. <div>) nor does it use the innerRef prop.\n\n' +
  'See https://goo.gl/LrBNgw for more info.';

/**
 * Raise an error if "children" is not a DOM Element and there is no ref provided to Waypoint
 *
 * @param {?React.element} children
 * @param {?HTMLElement} ref
 * @return {undefined}
 */
export default function ensureRefIsProvidedByChild(children, ref) {
  if (children && !isDOMElement(children) && !ref) {
    throw new Error(errorMessage);
  }
}
