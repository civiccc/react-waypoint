import { INVISIBLE, INSIDE, BELOW, ABOVE } from './constants';

/**
 * @param {object} bounds An object with bounds data for the waypoint and
 *   scrollable parent
 * @return {string} The current position of the waypoint in relation to the
 *   visible portion of the scrollable parent. One of the constants `ABOVE`,
 *   `BELOW`, `INSIDE` or `INVISIBLE`.
 */
export default function getCurrentPosition(bounds) {
  if (bounds.viewportBottom - bounds.viewportTop === 0) {
    return INVISIBLE;
  }

  // top is within the viewport
  if (bounds.viewportTop <= bounds.waypointTop &&
      bounds.waypointTop <= bounds.viewportBottom) {
    return INSIDE;
  }

  // bottom is within the viewport
  if (bounds.viewportTop <= bounds.waypointBottom &&
      bounds.waypointBottom <= bounds.viewportBottom) {
    return INSIDE;
  }

  // top is above the viewport and bottom is below the viewport
  if (bounds.waypointTop <= bounds.viewportTop &&
      bounds.viewportBottom <= bounds.waypointBottom) {
    return INSIDE;
  }

  if (bounds.viewportBottom < bounds.waypointTop) {
    return BELOW;
  }

  if (bounds.waypointTop < bounds.viewportTop) {
    return ABOVE;
  }

  return INVISIBLE;
}
