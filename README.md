# React Waypoint

[![npm version](https://badge.fury.io/js/react-waypoint.svg)](http://badge.fury.io/js/react-waypoint)
[![Build Status](https://travis-ci.org/brigade/react-waypoint.svg?branch=master)](https://travis-ci.org/brigade/react-waypoint)

A React component to execute a function whenever you scroll to an element. Works
in all containers that can scroll, including the window.

React Waypoint can be used to build features like lazy loading content, infinite
scroll, scrollspies, or docking elements to the viewport on scroll.

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
     * `topOffset` can either be a number, in which case its a distance from the
     * top of the container in pixels, or a string value. Valid string values are
     * of the form "20px", which is parsed as pixels, or "20%", which is parsed
     * as a percentage of the height of the containing element.
     * For instance, if you pass "-20%", and the containing element is 100px tall,
     * then the waypoint will be triggered when it has been scrolled 20px beyond
     * the top of the containing element.
     */
    topOffset: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    /**
     * `bottomOffset` is like `topOffset`, but for the bottom of the container.
     */
    bottomOffset: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

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
     * The `throttleHandler` prop provides a function that throttle the internal
     * scroll handler to increase performance.
     * See the section on "Throttling" for details on how to use it.
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

In most cases, the above two properties should be enough. In some cases
though, you might find these additional properties useful:

- `event` - the native [scroll
  event](https://developer.mozilla.org/en-US/docs/Web/Events/scroll) that
  triggered the callback. May be missing if the callback wasn't triggered
  as the result of a scroll.
- `waypointTop` - the waypoint's distance to the top of the viewport.
- `viewportTop` - the distance from the scrollable ancestor to the
  viewport top.
- `viewportBottom` - the distance from the bottom of the scrollable
  ancestor to the viewport top.

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

## Offsets and Boundaries

Two of the Waypoint props are `topOffset` and `bottomOffset`. To appreciate
what these can do for you, it will help to have an understanding of the
"boundaries" used by this library. The boundaries of React Waypoint are the top
and bottom of the element containing your scrollable content ([although this element
can be configured](#containing-elements-and-scrollableancestor)). When a
waypoint is within these boundaries, it is considered to be "inside." When a
waypoint passes beyond these boundaries, then it is "outside." The `onEnter` and
`onLeave` props are called as an element transitions from being inside to
outside, or vice versa.

The `topOffset` and `bottomOffset` properties can adjust the placement of these
boundaries. By default, the offset is `'0px'`. If you specify a positive value,
then the boundaries will be pushed inward, toward the center of the page. If
you specify a negative value for an offset, then the boundary will be pushed
outward from the center of the page.

#### Example Usage

Positive values of the offset props are useful when you have an element that
overlays your scrollable area. For instance, if your app has a `50px` fixed
header, then you may want to specify `topOffset='50px'`, so that the
`onEnter` callback is called when waypoints scroll into view from beneath the
header.

Negative values of the offset prop could be useful for lazy loading. Imagine if
you had a lot of large images on a long page, but you didn't want to load them
all at once. You can use React Waypoint to receive a callback whenever an image
is a certain distance from the bottom of the page. For instance, by specifying
`bottomOffset='-200px'`, then your `onEnter` callback would be called when
the waypoint comes closer than 200 pixels from the bottom edge of the page. By
placing a waypoint near each image, you could dynamically load them.

There are likely many more use cases for the offsets: be creative! Also, keep in
mind that there are _two_ boundaries, so there are always _two_ positions when
the `onLeave` and `onEnter` callback will be called. By using the arguments
passed to the callbacks, you can determine whether the waypoint has crossed the
top boundary or the bottom boundary.

## Containing elements and `scrollableAncestor`

React Waypoint positions its [boundaries](#offsets-and-boundaries) based on the
first scrollable ancestor of the Waypoint.

If that algorithm doesn't work for your use case, then you might find the
`scrollableAncestor` prop useful. It allows you to specify what the scrollable
ancestor is. Pass a node as that prop, and the Waypoint will use the scroll
position of *that* node, rather than its first scrollable ancestor.

#### Example Usage

Sometimes, waypoints that are deeply nested in the DOM tree may need to track
the scroll position of the page as a whole. If you want to be sure that no other
scrollable ancestor is used (since, once again, the first scrollable ancestor is
what the library will use by default), then you can explicitly set the
`scrollableAncestor` to be the `window` to ensure that no other element is used.

This might look something like:

```jsx
<Waypoint
  scrollableAncestor={window}
  onEnter={this._handleWaypointEnter}
  onLeave={this._handleWaypointLeave}
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

<Waypoint throttleHandler={(scrollHandler) => throttle(scrollHandler, 100)} />
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
    throttledHandler = throttle(scrollHandler, 100);
    return throttledHandler;
  }}
  ref={function(component) {
    if (!component) {
      throttledHandler.cancel();
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
