var React = require('../node_modules/react/react.js');
var Waypoint = require('../src/waypoint.jsx');

var div;

var renderAttached = function(component) {
  div = document.createElement('div');
  document.documentElement.appendChild(div);
  var renderedComponent = React.render(component, div);
  return renderedComponent;
};

var scrollNodeTo = function(node, scrollTop) {
  if (node === window) {
    window.scroll(0, scrollTop);
  } else {
    node.scrollTop = scrollTop;
  }
  var event = document.createEvent('Event');
  event.initEvent('scroll', false, false);
  node.dispatchEvent(event);
};

describe('Waypoint', function() {
  beforeEach(function() {
    this.props = {
      onEnter: jasmine.createSpy(),
      onLeave: jasmine.createSpy(),
      threshold: 0,
    };

    this.parentStyle = {
      height: 100,
      overflow: 'auto',
      position: 'relative',
      width: 100,
    };

    this.topSpacerHeight = 0;
    this.bottomSpacerHeight = 0;

    this.subject = function() {
      return renderAttached(
        React.createElement('div', { style: this.parentStyle },
          React.createElement('div', { style: { height: this.topSpacerHeight } }),
          React.createElement(Waypoint, this.props),
          React.createElement('div', { style: { height: this.bottomSpacerHeight } })
        )
      );
    };
  });

  afterEach(function() {
    if (div) {
      React.unmountComponentAtNode(div);
    }
  });

  describe('when the Waypoint is visible on mount', function() {
    beforeEach(function() {
      this.topSpacerHeight = 90;
      this.bottomSpacerHeight = 200;
      this.scrollable = this.subject().getDOMNode();
    });

    it('calls the onEnter handler', function() {
      expect(this.props.onEnter).toHaveBeenCalled();
    });

    it('does not call the onLeave handler', function() {
      expect(this.props.onLeave).not.toHaveBeenCalled();
    });

    describe('when scrolling while the waypoint is visible', function() {
      beforeEach(function() {
        scrollNodeTo(this.scrollable, this.topSpacerHeight / 2);
      });

      it('does not call the onEnter handler again', function() {
        expect(this.props.onEnter.calls.count()).toBe(1);
      });

      it('does not call the onLeave handler', function() {
        expect(this.props.onLeave).not.toHaveBeenCalled();
      });

      describe('when scrolling past it', function() {
        beforeEach(function() {
          scrollNodeTo(this.scrollable, this.topSpacerHeight + 10);
        });

        it('the onLeave handler is called', function() {
          expect(this.props.onLeave).toHaveBeenCalled();
        });

        it('does not call the onEnter handler', function() {
          expect(this.props.onEnter.calls.count()).toBe(1);
        });
      });
    });
  });

  describe('when the Waypoint is below the bottom', function() {
    beforeEach(function() {
      this.topSpacerHeight = 200;
    });

    it('does not call the onEnter handler on mount', function() {
      this.subject();
      expect(this.props.onEnter).not.toHaveBeenCalled();
    });

    it('does not call the onLeave handler on mount', function() {
      this.subject();
      expect(this.props.onLeave).not.toHaveBeenCalled();
    });

    describe('when scrolling down just below the threshold', function() {
      beforeEach(function() {
        scrollNodeTo(this.subject().getDOMNode(), 99);
      });

      it('does not call the onEnter handler', function() {
        expect(this.props.onEnter).not.toHaveBeenCalled();
      });

      it('does not call the onLeave handler', function() {
        expect(this.props.onLeave).not.toHaveBeenCalled();
      });
    });

    describe('when scrolling down past the threshold', function() {
      beforeEach(function() {
        scrollNodeTo(this.subject().getDOMNode(), 100);
      });

      it('calls the onEnter handler', function() {
        expect(this.props.onEnter).toHaveBeenCalled();
      });

      it('does not call the onLeave handler', function() {
        expect(this.props.onLeave).not.toHaveBeenCalled();
      });
    });

    describe('with a non-zero threshold', function() {
      beforeEach(function() {
        this.props.threshold = 0.1;
      });

      describe('when scrolling down just below the threshold', function() {
        beforeEach(function() {
          scrollNodeTo(this.subject().getDOMNode(), 89);
        });

        it('does not call the onEnter handler', function() {
          expect(this.props.onEnter).not.toHaveBeenCalled();
        });

        it('does not call the onLeave handler', function() {
          expect(this.props.onLeave).not.toHaveBeenCalled();
        });
      });

      describe('when scrolling down past the threshold', function() {
        beforeEach(function() {
          scrollNodeTo(this.subject().getDOMNode(), 90);
        });

        it('calls the onEnter handler', function() {
          expect(this.props.onEnter).toHaveBeenCalled();
        });

        it('does not call the onLeave handler', function() {
          expect(this.props.onLeave).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('when the Waypoint is above the top', function() {
    beforeEach(function() {
      this.topSpacerHeight = 200;
      this.bottomSpacerHeight = 200;
      this.scrollable = this.subject().getDOMNode();
      scrollNodeTo(this.scrollable, 400);
    });

    it('does not call the onEnter handler', function() {
      expect(this.props.onEnter).not.toHaveBeenCalled();
    });

    it('does not call the onLeave handler', function() {
      expect(this.props.onLeave).not.toHaveBeenCalled();
    });

    describe('when scrolling up not past the threshold', function() {
      beforeEach(function() {
        scrollNodeTo(this.scrollable, 201);
      });

      it('does not call the onEnter handler', function() {
        expect(this.props.onEnter).not.toHaveBeenCalled();
      });

      it('does not call the onLeave handler', function() {
        expect(this.props.onLeave).not.toHaveBeenCalled();
      });
    });

    describe('when scrolling up past the threshold', function() {
      beforeEach(function() {
        scrollNodeTo(this.scrollable, 200);
      });

      it('calls the onEnter handler', function() {
        expect(this.props.onEnter).toHaveBeenCalled();
      });

      it('does not call the onLeave handler', function() {
        expect(this.props.onLeave).not.toHaveBeenCalled();
      });

      describe('when scrolling up past the waypoint', function() {
        beforeEach(function() {
          scrollNodeTo(this.scrollable, 99);
        });

        it('calls the onLeave handler', function() {
          expect(this.props.onLeave).toHaveBeenCalled();
        });

        it('does not call the onEnter handler again', function() {
          expect(this.props.onEnter.calls.count()).toBe(1);
        });
      });
    });
  });

  describe('when the scrollable parent does not have positioning', function() {
    beforeEach(function() {
      delete this.parentStyle.position;
    });

    it('throws an error', function() {
      expect(
        function() {
          this.subject();
        }.bind(this)
      ).toThrow();
    });
  });

  describe('when the window is the scrollable parent', function() {
    beforeEach(function() {
      // Make the normal parent non-scrollable
      this.parentStyle = {};

      // Make the spacers large enough to make the Waypoint render off-screen
      this.topSpacerHeight = window.innerHeight + 1000;
      this.bottomSpacerHeight = 1000;
    });

    it('does not fire the onEnter handler on mount', function() {
      expect(this.props.onEnter).not.toHaveBeenCalled();
    });

    describe('when the Waypoint is in view', function() {
      beforeEach(function() {
        this.subject();
        scrollNodeTo(window, this.topSpacerHeight - window.innerHeight / 2);
      });

      it('fires the onEnter handler', function() {
        expect(this.props.onEnter).toHaveBeenCalled();
      });
    });
  });
});
