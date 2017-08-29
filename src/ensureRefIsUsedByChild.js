import isDOMElement from './isDOMElement';

export const errorMessage =
  '<Waypoint> needs a DOM element to compute boundaries. The child you passed is neither a ' +
  'DOM element (e.g. <div>) nor does it have a ref or innerRef function.\n\n' +
  'See /* TODO: shortlink */ for more info.';

/**
 * Raise an error if "children" is not a DOM Element and there is no ref provided to Waypoint
 *
 * @param {?(React.element|Function)} children
 * @param {?HTMLElement} ref
 * @return {undefined}
 */
export default function ensureRefIsProvidedByChild(children, ref) {
  if (children && !isDOMElement(children) && !ref) {
    throw new Error(errorMessage);
  }
}
