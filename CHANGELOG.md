## master (unreleased)

- Replace `this.getDOMNode()` with `React.findDOMNode(this)`

## 1.0.2

- Add event object and scope to onEnter/onLeave calls
- Allow React 0.14.0-beta peerDependency
- Always remove window resize event listener

## 1.0.1

- Ignore more files for bower and npm packages
- Commit the built version for bower package

## 1.0.0

- Add 'jsx' syntax to the unbuilt version of the component, and build into
  'build/ReactWaypoint.js' with webpack.
- Fix corner case where scrollable parent is not the window and the window
  resize should trigger a Waypoint callback.

## 0.3.0

- Fix Waypoints with the window element as their scrollable parent (Firefox
  only)

## 0.2.0

- Fix Waypoints with the window element as their scrollable parent
- Change default threshold from 0.1 to 0
- Guard against undefined scrollable parent when unmounting

## 0.1.0

- Initial release
