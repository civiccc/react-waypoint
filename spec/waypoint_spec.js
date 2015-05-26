const React = require('../node_modules/react/react.js');
const Waypoint = require('../src/waypoint.jsx');

let div;

const renderAttached = function(component) {
  div = document.createElement('div');
  document.body.appendChild(div);
  const renderedComponent = React.render(component, div);
  return renderedComponent;
};

const scrollNodeTo = function(node, scrollTop) {
  if (node === window) {
    window.scroll(0, scrollTop);
  } else {
    node.scrollTop = scrollTop;
  }
  const event = document.createEvent('Event');
  event.initEvent('scroll', false, false);
  node.dispatchEvent(event);
};

describe('Waypoint', function() {
  beforeEach(() => {
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

    this.subject = () => {
      return renderAttached(
        React.createElement('div', { style: this.parentStyle },
          React.createElement(
            'div', { style: { height: this.topSpacerHeight } }),
          React.createElement(Waypoint, this.props),
          React.createElement(
            'div', { style: { height: this.bottomSpacerHeight } })
        )
      );
    };
  });

  afterEach(() => {
    if (div) {
      React.unmountComponentAtNode(div);
    }
  });

  describe('when the Waypoint is visible on mount', () => {
    beforeEach(() => {
      this.topSpacerHeight = 90;
      this.bottomSpacerHeight = 200;
      this.scrollable = this.subject().getDOMNode();
    });

    it('calls the onEnter handler', () => {
      expect(this.props.onEnter).toHaveBeenCalled();
    });

    it('does not call the onLeave handler', () => {
      expect(this.props.onLeave).not.toHaveBeenCalled();
    });

    describe('when scrolling while the waypoint is visible', () => {
      beforeEach(() => {
        scrollNodeTo(this.scrollable, this.topSpacerHeight / 2);
      });

      it('does not call the onEnter handler again', () => {
        expect(this.props.onEnter.calls.count()).toBe(1);
      });

      it('does not call the onLeave handler', () => {
        expect(this.props.onLeave).not.toHaveBeenCalled();
      });

      describe('when scrolling past it', () => {
        beforeEach(() => {
          scrollNodeTo(this.scrollable, this.topSpacerHeight + 10);
        });

        it('the onLeave handler is called', () => {
          expect(this.props.onLeave).toHaveBeenCalled();
        });

        it('does not call the onEnter handler', () => {
          expect(this.props.onEnter.calls.count()).toBe(1);
        });
      });
    });
  });

  describe('when the Waypoint is below the bottom', () => {
    beforeEach(() => {
      this.topSpacerHeight = 200;
    });

    it('does not call the onEnter handler on mount', () => {
      this.subject();
      expect(this.props.onEnter).not.toHaveBeenCalled();
    });

    it('does not call the onLeave handler on mount', () => {
      this.subject();
      expect(this.props.onLeave).not.toHaveBeenCalled();
    });

    describe('when scrolling down just below the threshold', () => {
      beforeEach(() => {
        scrollNodeTo(this.subject().getDOMNode(), 99);
      });

      it('does not call the onEnter handler', () => {
        expect(this.props.onEnter).not.toHaveBeenCalled();
      });

      it('does not call the onLeave handler', () => {
        expect(this.props.onLeave).not.toHaveBeenCalled();
      });
    });

    describe('when scrolling down past the threshold', () => {
      beforeEach(() => {
        scrollNodeTo(this.subject().getDOMNode(), 100);
      });

      it('calls the onEnter handler', () => {
        expect(this.props.onEnter).toHaveBeenCalled();
      });

      it('does not call the onLeave handler', () => {
        expect(this.props.onLeave).not.toHaveBeenCalled();
      });
    });

    describe('with a non-zero threshold', () => {
      beforeEach(() => {
        this.props.threshold = 0.1;
      });

      describe('when scrolling down just below the threshold', () => {
        beforeEach(() => {
          scrollNodeTo(this.subject().getDOMNode(), 89);
        });

        it('does not call the onEnter handler', () => {
          expect(this.props.onEnter).not.toHaveBeenCalled();
        });

        it('does not call the onLeave handler', () => {
          expect(this.props.onLeave).not.toHaveBeenCalled();
        });
      });

      describe('when scrolling down past the threshold', () => {
        beforeEach(() => {
          scrollNodeTo(this.subject().getDOMNode(), 90);
        });

        it('calls the onEnter handler', () => {
          expect(this.props.onEnter).toHaveBeenCalled();
        });

        it('does not call the onLeave handler', () => {
          expect(this.props.onLeave).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('when the Waypoint is above the top', () => {
    beforeEach(() => {
      this.topSpacerHeight = 200;
      this.bottomSpacerHeight = 200;
      this.scrollable = this.subject().getDOMNode();
      scrollNodeTo(this.scrollable, 400);
    });

    it('does not call the onEnter handler', () => {
      expect(this.props.onEnter).not.toHaveBeenCalled();
    });

    it('does not call the onLeave handler', () => {
      expect(this.props.onLeave).not.toHaveBeenCalled();
    });

    describe('when scrolling up not past the threshold', () => {
      beforeEach(() => {
        scrollNodeTo(this.scrollable, 201);
      });

      it('does not call the onEnter handler', () => {
        expect(this.props.onEnter).not.toHaveBeenCalled();
      });

      it('does not call the onLeave handler', () => {
        expect(this.props.onLeave).not.toHaveBeenCalled();
      });
    });

    describe('when scrolling up past the threshold', () => {
      beforeEach(() => {
        scrollNodeTo(this.scrollable, 200);
      });

      it('calls the onEnter handler', () => {
        expect(this.props.onEnter).toHaveBeenCalled();
      });

      it('does not call the onLeave handler', () => {
        expect(this.props.onLeave).not.toHaveBeenCalled();
      });

      describe('when scrolling up past the waypoint', () => {
        beforeEach(() => {
          scrollNodeTo(this.scrollable, 99);
        });

        it('calls the onLeave handler', () => {
          expect(this.props.onLeave).toHaveBeenCalled();
        });

        it('does not call the onEnter handler again', () => {
          expect(this.props.onEnter.calls.count()).toBe(1);
        });
      });
    });
  });

  describe('when the scrollable parent does not have positioning', () => {
    beforeEach(() => {
      delete this.parentStyle.position;
    });

    it('throws an error', () => {
      expect(this.subject).toThrow();
    });
  });

  describe('when the window is the scrollable parent', () => {
    beforeEach(() => {
      // Make the normal parent non-scrollable
      this.parentStyle = {};

      // Make the spacers large enough to make the Waypoint render off-screen
      this.topSpacerHeight = window.innerHeight + 1000;
      this.bottomSpacerHeight = 1000;
    });

    it('does not fire the onEnter handler on mount', () => {
      expect(this.props.onEnter).not.toHaveBeenCalled();
    });

    describe('when the Waypoint is in view', () => {
      beforeEach(() => {
        this.subject();
        scrollNodeTo(window, this.topSpacerHeight - window.innerHeight / 2);
      });

      it('fires the onEnter handler', () => {
        expect(this.props.onEnter).toHaveBeenCalled();
      });
    });
  });
});
