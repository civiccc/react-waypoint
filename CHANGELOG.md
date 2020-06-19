## 9.0.3

- Make waypoints work with `overflow: overlay`

## 9.0.2

- Remove StrictMode warnings

## 9.0.1

- Fix export in TypeScript types (#298)
- Update babel 6 -> 7, rollup 0 -> 1 (#301)

## 9.0.0

- [Breaking] Require React 15.3+
- [Breaking] Make Waypoint a named export instead of default export
- Change constants into named exports for better minification
- Fix removing propTypes in production builds
- Ensure that children is valid only in dev
- Fix isForwardRef call

## 8.1.0

- Improve support for refs (#278)
- Don't include `.babelrc` in published npm package (#270)

## 8.0.3

- Defer `handleScroll` in `componentDidUpdate` ([#265](https://github.com/brigade/react-waypoint/pull/265))
- Extend `React.PureComponent` instead of `React.Component` when available ([#264](https://github.com/brigade/react-waypoint/pull/264))

## 8.0.2

- Allow consolidated-events ^2.0.0 ([#256](https://github.com/brigade/react-waypoint/pull/256))
- Add message to better understand logged error message in tests ([#255](https://github.com/brigade/react-waypoint/pull/255))

## 8.0.1

- Fix default export error in typescript definition file

## 8.0.0

- Add es module entry point in package.json
- Type Waypoint class properties as static
- Let proptypes be removable in consumers production bundles

## 7.3.4

- Fix second arg to Typescript component definition

## 7.3.3

- Add second arg to Typescript component definition

## 7.3.2

- Fix typescript definition

## 7.3.1

- Make es module opt in (via `import Waypoint from 'react-waypoint/es'`)

## 7.3.0

- Build with rollup.
- Add an ES module build.

## 7.2.0

- Allow React 16 as a peerDependency.
- Remove scrollableParent prop check error.

## 7.1.0

- Add support for using composite components as child (#208)

## 7.0.4

- Update consolidated-events from 1.0.1 to 1.1.0.

## 7.0.3

- Fix bug in onNextTick.

## 7.0.2

- Fix bug if waypoint updates before being initialized.

## 7.0.1

- Improve startup time by consolidating `setTimeout`s and deferring work until
  the initial timeout happens.

## 7.0.0

- Move `prop-types` to a regular dependency
- Assume `window` as scrollable ancestor when `<body>` has `overflow: auto|scroll`
- Restrict lower bound of React to v0.14.9

## 6.0.0

- Add `prop-types` as a peer dependency to remove deprecation warnings when
  running on React 15.5

## 5.3.1

- Remove the `prop-types` peer dependency. This was an accidental breaking
  change that will instead be released as 6.0.0.

## 5.3.0

- Remove deprecation warnings when running on React 15.5
- Add React 14 to Travis test suite.

## 5.2.1

- [Fix] Avoid unnecessary clearTimeout when unmounting.

## 5.2.0

- [New] scrollableAncestor prop can now accept "window" as a string. This should
  help with server rendering.
- Debug code is now minified out in production build.

## 5.1.0

- Waypoint can now accept children.

## 5.0.3

- Clear initial timeout when unmounting component.

## 5.0.2
- Revert ES6 typescript definition.

## 5.0.1
- Fix typescript definition to support ES6 imports

## 5.0.0

- [Breaking] Remove `throttleHandler`
- Add typescript definitions file

## 4.1.0

- Add `horizontal` prop. Use it to make the waypoint trigger on horizontal scrolling.

## 4.0.4

- Delay initial calling of handleScroll when mounting.

## 4.0.3

- Extract event listener code to consolidated-events package.

## 4.0.2

- Prevent event listeners from leaking.

## 4.0.1

- Fix error when a waypoint unmounts another waypoint as part of handling a
  (scroll/resize) event.

## 4.0.0

- [Breaking] Use passive event listeners in browsers that support them. This
  will break any Waypoint event handler that was calling
  `event.preventDefault()`.
- Initialize fewer event listeners.

## 3.1.3

- Avoid warnings from React about calling PropTypes directly (#119).

## 3.1.2

This version contains a fix for errors of the following kind:

```
Unable to get property 'getBoundingClientRect' of undefined or null reference
```

## 3.1.1

- Fix passing props to super class, to make react-waypoint compatible with [preact](https://github.com/developit/preact) (thanks @kamotos!)

## 3.1.0

New properties have been added to the `onEnter`/`onLeave`/`onPositionChange`
callbacks:

- `waypointTop` - the waypoint's distance to the top of the viewport.
- `viewportTop` - the distance from the scrollable ancestor to the viewport top.
- `viewportBottom` - the distance from the bottom of the scrollable ancestor to
  the viewport top.

## 3.0.0

- Change `threshold` to `bottomOffset` and `topOffset`
- Add `throttleHandler` prop to allow scrolling to be throttled

## 2.0.3

- Added `debug` prop

## 2.0.2

- Improved position calculation

## 2.0.1

- Add React 15 support

## 2.0.0

- Breaking: Unify arguments passed to callbacks
- Add `displayName`

## 1.3.1

- Handle invisible waypoint parents
- Add `onPositionChange`

## 1.3.0

- Rename `scrollableParent` prop to `scrollableAncestor`

## 1.2.3

- Simplify `getWindow` usage
- Allow any `scrollableParent`

## 1.2.2

- Add `fireOnRapidScroll` prop

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
