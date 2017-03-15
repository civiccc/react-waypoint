import constants from './constants';

/**
 * @param {object} bounds An object with bounds data for the waypoint and
 *   scrollable parent
 * @return {string} The current position of the waypoint in relation to the
 *   visible portion of the scrollable parent. One of `constants.above`,
 *   `constants.below`, or `constants.inside`.
 */
export default function getCurrentPosition(bounds) {
  if (bounds.viewportBottom - bounds.viewportTop === 0) {
    return constants.invisible;
  }

  // top is within the viewport
  if (bounds.viewportTop <= bounds.waypointTop &&
      bounds.waypointTop <= bounds.viewportBottom) {
    return constants.inside;
  }

  // bottom is within the viewport
  if (bounds.viewportTop <= bounds.waypointBottom &&
      bounds.waypointBottom <= bounds.viewportBottom) {
    return constants.inside;
  }

  // top is above the viewport and bottom is below the viewport
  if (bounds.waypointTop <= bounds.viewportTop &&
      bounds.viewportBottom <= bounds.waypointBottom) {
    return constants.inside;
  }

  if (bounds.viewportBottom < bounds.waypointTop) {
    return constants.below;
  }

  if (bounds.waypointTop < bounds.viewportTop) {
    return constants.above;
  }

  return constants.invisible;
}
