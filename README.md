#React-Waypoint

A React component to execute a function whenever you scroll to an element.

Compare to [jQuery-Waypoints][jquery-waypoints] and [Waypoints][waypoints],
except this little library grooves the React way.

[jquery-waypoints]: https://github.com/imakewebthings/jquery-waypoints
[waypoints]: https://github.com/imakewebthings/waypoints

##Usage

```javascript
var Waypoint = require('react-waypoint');
```

```javascript
<Waypoint onEnter={this._handleWaypoint} threshold={0.2} />
```

##Prop types

```javascript
  propTypes: {
    onEnter: PropTypes.func, // function called when waypoint enters viewport
    onLeave: PropTypes.func, // function called when waypoint leaves viewport
    threshold: PropTypes.number, // threshold is percentage of the height of
    // the visible part of the scrollable parent (e.g. 0.1)
  },
```

##Credits

Credit to [trotzig][trotzig-github] and [lencioni][lencioni-github] for writing
this component, and the [Brigade team][brigade-github] for open sourcing it.

Thanks to the creator of the original Waypoints library,
[imakewebthings][imakewebthings-github].

[lencioni-github]: https://github.com/lencioni
[trotzig-github]: https://github.com/trotzig
[brigade-github]: https://github.com/brigade/
[imakewebthings-github]: https://github.com/imakewebthings

##License

[MIT][mit-license]

[mit-license]: ./LICENSE
