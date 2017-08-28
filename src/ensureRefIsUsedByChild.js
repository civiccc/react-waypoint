import isFunction from './isFunction';

/**
 * Raise an error if "children" is a function and there is no ref in Waypoint
 *
 * @param {*} children
 * @param {*} ref
 * @return {undefined}
 */
export default function ensureRefIsUsedByChild(children, ref) {
  if (children && isFunction(children) && !ref) {
    throw new Error(
      'No ref was provided to Waypoint component. If you are using function as a child, ' +
      'make sure that you passed a ref function to the component you want to render.'
    );
  }
}
