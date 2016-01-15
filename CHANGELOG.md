## master (unreleased)

## 1.2.1
- Make bundled waypoint.js easier to import

## 1.2.0

- Upgrade Babel from 5 to 6
- Convert from CommonJS to ES2015 modules
- Convert from React.createClass to ES2015 class
- Remove bower support

## 1.1.3

- Calculate proper offset when <html> or <body> has a margin

## 1.1.2

- Fix built version

## 1.1.1

- Add statics for edge argument used by `onEnter` and `onLeave`
- Prevent scroll handler from blowing up if the component is not mounted at the
  time of execution

## 1.1.0

- Add second parameter to `onEnter` and `onLeave` callbacks to indicate
  from which direction the waypoint entered _from_ and _to_ respectively

## 1.0.6

- Prevent duplicate onError/onLeave callbacks

## 1.0.5

- Prevent error when `<html>` has a scrollable overflow styling

## 1.0.4

- Bump `react` dependency to 0.14 and add `react-dom` to `peerDependencies`

## 1.0.3

- Replace `this.getDOMNode()` with `React.findDOMNode(this)`
- Improve support for scrolling very quickly

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
