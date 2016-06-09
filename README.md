# React Waypoint

[![npm version](https://badge.fury.io/js/react-waypoint.svg)](http://badge.fury.io/js/react-waypoint)
[![Build Status](https://travis-ci.org/brigade/react-waypoint.svg?branch=master)](https://travis-ci.org/brigade/react-waypoint)

A React component to execute a function whenever you scroll to an element. Works
in all containers that can scroll, including the window.

React Waypoint can be used to build features like lazy loading content, infinite
scroll, or docking elements to the viewport on scroll.

Inspired by [Waypoints][waypoints], except this little library grooves the
[React][react] way.

## Demo
![Demo of React Waypoint in action](https://raw.github.com/brigade/react-waypoint/master/react-waypoint-demo.gif)

[View demo page][demo-page]

[waypoints]: https://github.com/imakewebthings/waypoints
[react]: https://github.com/facebook/react
[demo-page]: http://brigade.github.io/react-waypoint/

## Installation

### npm

```bash
npm install react-waypoint --save
```

## Usage

```javascript
var Waypoint = require('react-waypoint');
```

```javascript
<Waypoint
  onEnter={this._handleWaypointEnter}
  onLeave={this._handleWaypointLeave}
/>
```

A waypoint normally fires `onEnter` and `onLeave` as you are scrolling, but it
can fire because of other events too:

- When the window is resized
- When it is mounted (fires `onEnter` if it's visible on the page)
- When it is updated/re-rendered by its parent

Callbacks will only fire if the new position changed from the last known
position. Sometimes it's useful to have a waypoint that fires `onEnter` every
time it is updated as long as it stays visible (e.g. for infinite scroll). You
can then use a `key` prop to control when a waypoint is reused vs. re-created.

```javascript
<Waypoint
  key={cursor}
  onEnter={this._loadMoreContent}
/>
```

Alternatively, you can also use an `onPositionChange` event to just get
notified when the waypoint's position (e.g. inside the viewport, above or
below) has changed.

```javascript
<Waypoint
  onPositionChange={this._handlePositionChange}
/>
```


### Example: [JSFiddle Example][jsfiddle-example]

[jsfiddle-example]: http://jsfiddle.net/L4z5wcx0/7/

## Prop types

```javascript
  propTypes: {

    /**
     * Function called when waypoint enters viewport
     */
    onEnter: PropTypes.func,

    /**
     * Function called when waypoint leaves viewport
     */
    onLeave: PropTypes.func,

    /**
     * Function called when waypoint position changes
     */
    onPositionChange: PropTypes.func,

    /**
     * Threshold - a percentage of the height of the visible
     * part of the scrollable parent (e.g. 0.1)
     */
    threshold: PropTypes.number,

    /**
     * Scrollable Ancestor - A custom ancestor to determine if the
     * target is visible in it. This is useful in cases where
     * you do not want the immediate scrollable ancestor to be
     * the container. For example, when your target is in a div
     * that has overflow auto but you are detecting onEnter based
     * on the window.
     */
    scrollableAncestor: PropTypes.any,

    /**
     * fireOnRapidScroll - if the onEnter/onLeave events are to be fired
     * on rapid scrolling. This has no effect on onPositionChange -- it will
     * fire anyway.
     */
    fireOnRapidScroll: PropTypes.bool,

    /**
     * Use this prop to get debug information in the console log. This slows
     * things down significantly, so it should only be used during development.
     */
    debug: PropTypes.bool,

    /**
     * The `throttleHandler` prop provides a way to throttle scroll callbacks
     * to increase performance. See the section on "Throttling" for details on
     * how to use it.
     */
    throttleHandler: PropTypes.func,
  },
```

All callbacks (`onEnter`/`onLeave`/`onPositionChange`) receive an object as the
only argument. That object has the following properties:

- `currentPosition` - the position that the waypoint has at the moment. One
  of `Waypoint.below`, `Waypoint.above`, `Waypoint.inside`,
  and `Waypoint.invisible`.
- `previousPosition` - the position that the waypoint had before. Also one
  of `Waypoint.below`, `Waypoint.above`, `Waypoint.inside`,
  and `Waypoint.invisible`.
- `event` - the native [scroll
  event](https://developer.mozilla.org/en-US/docs/Web/Events/scroll) that
  triggered the callback. May be missing if the callback wasn't triggered as
  the result of a scroll.

If you use [es6 object
destructuring](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment),
this means that you can use waypoints in the following way:

```jsx
<Waypoint onEnter={({ previousPosition, currentPosition, event }) => {
    // do something useful!
  }}
/>
```

If you are more familiar with plain old js functions, you'll do something like
this:

```jsx
<Waypoint onEnter={function(props) {
    // here you can use `props.currentPosition`, `props.previousPosition`, and
    // `props.event`
  }}
/>
```

## Throttling
By default, waypoints will trigger on every scroll event. In most cases, this
works just fine. But if you find yourself wanting to tweak the scrolling
performance, the `throttleHandler` prop can come in handy. You pass in a
function that returns a different (throttled) version of the function passed
in. Here's an example using
[lodash.throttle](https://www.npmjs.com/package/lodash.throttle):

```jsx
import throttle from 'lodash.throttle';

<Waypoint throttleHandler={(scrollHandler) => lodashThrottle(scrollHandler, 100)} />
```

The argument passed in to the throttle handler function, `scrollHandler`, is
waypoint's internal scroll handler. The `throttleHandler` is only invoked once
during the lifetime of a waypoint (when the waypoint is mounted).

To prevent errors coming from the fact that the scroll handler can be called
after the waypoint is unmounted, it's a good idea to cancel the throttle
function on unmount:

```jsx
import throttle from 'lodash.throttle';

let throttledHandler;

<Waypoint throttleHandler={(scrollHandler) => {
    throttledHandler = lodashThrottle(scrollHandler, 100);
    return throttledHandler;
  }}
  ref={function(component) {
    if (!component) {
      throttledHandler.cancel()
    }
  }}
/>
```

## Troubleshooting
If your waypoint isn't working the way you expect it to, there are a few ways
you can debug your setup.

OPTION 1: Add the `debug={true}` prop to your waypoint. When you do, you'll see console
logs informing you about the internals of the waypoint.

OPTION 2: Clone and modify the project locally.
- clone this repo
- add `console.log` or breakpoints where you think it would be useful.
- `npm link` in the react-waypoint repo.
- `npm link react-waypoint` in your project.
- if needed rebuild react-waypoint module: `npm run build-npm`

## Limitations

In this component we make a few assumptions that we believe are generally safe,
but in some situations might present limitations.

- We determine the scrollable-ness of a node by inspecting its computed
  overflow-y or overflow property and nothing else. This could mean that a
  container with this style but that does not actually currently scroll will be
  considered when performing visibility calculations.
- We assume that waypoint is rendered within at most one scrollable container.
  If you render a waypoint in multiple nested scrollable containers, the
  visibility calculations will likely not be accurate.
- We also base the visibility calculations on the scroll position of the
  scrollable container (or `window` if no scrollable container is found). This
  means that if your scrollable container has a height that is greater than the
  window, it might trigger `onEnter` unexpectedly.

## Credits

Credit to [trotzig][trotzig-github] and [lencioni][lencioni-github] for writing
this component, and the [Brigade team][brigade-github] for open sourcing it.

Thanks to the creator of the original Waypoints library,
[imakewebthings][imakewebthings-github].

[lencioni-github]: https://github.com/lencioni
[trotzig-github]: https://github.com/trotzig
[brigade-github]: https://github.com/brigade/
[imakewebthings-github]: https://github.com/imakewebthings

## License

[MIT][mit-license]

[mit-license]: ./LICENSE
