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
export default function parseOffsetAsPercentage(str) {
  if (str.slice(-1) === '%') {
    return parseFloat(str.slice(0, -1)) / 100;
  }

  return undefined;
}
