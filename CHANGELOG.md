## master (unreleased)

## 1.0.0

- Add 'jsx' syntax to the unbuilt version of the component, and build into
  'build/ReactWaypoint.js' with webpack.

- Fix corner case where scrollable parent is not the window and the window
  resize should trigger a Waypoint callback.

## 0.3.0

- Fix Waypoints with the window element as their scrollable parent (Firefox only)

## 0.2.0

- Fix Waypoints with the window element as their scrollable parent
- Change default threshold from 0.1 to 0
- Guard against undefined scrollable parent when unmounting

## 0.1.0

- Initial release
