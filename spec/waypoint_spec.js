import React from 'react';
import ReactDOM from 'react-dom';
import Waypoint from '../src/waypoint.jsx';

let div;

const renderAttached = function(component) {
  div = document.createElement('div');
  document.body.appendChild(div);
  const renderedComponent = ReactDOM.render(component, div);
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

describe('<Waypoint>', function() {
  beforeEach(() => {
    this.props = {
      onEnter: jasmine.createSpy('onEnter'),
      onLeave: jasmine.createSpy('onLeave'),
      onPositionChange: jasmine.createSpy('onPositionChange'),
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
      ReactDOM.unmountComponentAtNode(div);
    }
    scrollNodeTo(window, 0);
  });

  describe('when the Waypoint is visible on mount', () => {
    beforeEach(() => {
      this.topSpacerHeight = 90;
      this.bottomSpacerHeight = 200;
      this.parentComponent = this.subject();
      this.scrollable = this.parentComponent;
    });

    it('calls the onEnter handler', () => {
      expect(this.props.onEnter).toHaveBeenCalledWith({
        currentPosition: Waypoint.inside,
        previousPosition: null,
        event: null
      });
    });

    it('calls the onPositionChange handler', () => {
      expect(this.props.onPositionChange).
        toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: null,
          event: null
        });
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

      it('does not call the onPositionChange handler again', () => {
        expect(this.props.onPositionChange.calls.count()).toBe(1);
      });

      describe('when scrolling past it', () => {
        beforeEach(() => {
          scrollNodeTo(this.scrollable, this.topSpacerHeight + 10);
        });

        it('the onLeave handler is called', () => {
          expect(this.props.onLeave).
            toHaveBeenCalledWith({
              currentPosition: Waypoint.above,
              previousPosition: Waypoint.inside,
              event: jasmine.any(Event),
            });
        });

        it('does not call the onEnter handler', () => {
          expect(this.props.onEnter.calls.count()).toBe(1);
        });

        it('the onPositionChange is called', () => {
          expect(this.props.onPositionChange).
            toHaveBeenCalledWith({
              currentPosition: Waypoint.above,
              previousPosition: Waypoint.inside,
              event: jasmine.any(Event),
            });
        });
      });
    });
  });

  describe('when the Waypoint is below the bottom', () => {
    beforeEach(() => {
      this.topSpacerHeight = 200;

      // The bottom spacer needs to be tall enough to force the Waypoint to exit
      // the viewport when scrolled all the way down.
      this.bottomSpacerHeight = 3000;
    });

    it('does not call the onEnter handler on mount', () => {
      this.subject();
      expect(this.props.onEnter).not.toHaveBeenCalled();
    });

    it('does not call the onLeave handler on mount', () => {
      this.subject();
      expect(this.props.onLeave).not.toHaveBeenCalled();
    });

    it('calls the onPositionChange handler', () => {
      this.subject();
      expect(this.props.onPositionChange).
        toHaveBeenCalledWith({
          currentPosition: Waypoint.below,
          previousPosition: null,
          event: null,
        });
    });

    describe('when scrolling down just below the threshold', () => {
      beforeEach(() => {
        this.component = this.subject();
        this.props.onPositionChange.calls.reset();
        scrollNodeTo(this.component, 99);
      });

      it('does not call the onEnter handler', () => {
        expect(this.props.onEnter).not.toHaveBeenCalled();
      });

      it('does not call the onLeave handler', () => {
        expect(this.props.onLeave).not.toHaveBeenCalled();
      });

      it('does not call the onPositionChange handler', () => {
        expect(this.props.onPositionChange).not.toHaveBeenCalled();
      });
    });

    describe('when scrolling down past the threshold', () => {
      beforeEach(() => {
        this.scrollDown = () => scrollNodeTo(this.subject(), 100);
      });

      it('calls the onEnter handler', () => {
        this.scrollDown();
        expect(this.props.onEnter).
          toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.below,
            event: jasmine.any(Event),
          });
      });

      it('calls the onPositionChange handler', () => {
        this.scrollDown();
        expect(this.props.onPositionChange).
          toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.below,
            event: jasmine.any(Event),
          });
      });

      it('does not call the onLeave handler', () => {
        this.scrollDown();
        expect(this.props.onLeave).not.toHaveBeenCalled();
      });

      describe('when `fireOnRapidScroll` is disabled', () => {
        beforeEach(() => {
          this.props.fireOnRapidScroll = false;
        });

        it('calls the onEnter handler', () => {
          this.scrollDown();
          expect(this.props.onEnter).
            toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
            });
        });

        it('calls the onPositionChange handler', () => {
          this.scrollDown();
          expect(this.props.onPositionChange).
            toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
            });
        });

        it('does not call the onLeave handler', () => {
          this.scrollDown();
          expect(this.props.onLeave).not.toHaveBeenCalled();
        });
      });
    });

    describe('when scrolling quickly past the waypoint', () => {
      // If you scroll really fast, we might not get a scroll event when the
      // waypoint is in view. We will get a scroll event before going into view
      // though, and one after. We want to treat this as if the waypoint was
      // visible for a brief moment, and so we fire both onEnter and onLeave.
      beforeEach(() => {
        this.scrollQuicklyPast = () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 5000);
        };
      });

      it('calls the onEnter handler', () => {
        this.scrollQuicklyPast();
        expect(this.props.onEnter).
          toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.below,
            event: jasmine.any(Event),
          });
      });

      it('calls the onLeave handler', () => {
        this.scrollQuicklyPast();
        expect(this.props.onLeave).
          toHaveBeenCalledWith({
            currentPosition: Waypoint.above,
            previousPosition: Waypoint.inside,
            event: jasmine.any(Event),
          });
      });

      it('calls the onPositionChange handler', () => {
        this.scrollQuicklyPast();
        expect(this.props.onPositionChange).
          toHaveBeenCalledWith({
            currentPosition: Waypoint.above,
            previousPosition: Waypoint.below,
            event: jasmine.any(Event),
          });
      });

      describe('when `fireOnRapidScroll` is disabled', () => {
        beforeEach(() => {
          this.props.fireOnRapidScroll = false;
        });

        it('does not call the onEnter handler', () => {
          this.scrollQuicklyPast();
          expect(this.props.onEnter).not.toHaveBeenCalled();
        });

        it('does not call the onLeave handler', () => {
          this.scrollQuicklyPast();
          expect(this.props.onLeave).not.toHaveBeenCalled();
        });

        it('calls the onPositionChange handler', () => {
          this.scrollQuicklyPast();
          expect(this.props.onPositionChange).
            toHaveBeenCalledWith({
              currentPosition: Waypoint.above,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
            });
        });
      });
    });

    describe('with a non-zero threshold', () => {
      beforeEach(() => {
        this.props.threshold = 0.1;
      });

      describe('when scrolling down just below the threshold', () => {
        beforeEach(() => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 89);
        });

        it('does not call the onEnter handler', () => {
          expect(this.props.onEnter).not.toHaveBeenCalled();
        });

        it('does not call the onLeave handler', () => {
          expect(this.props.onLeave).not.toHaveBeenCalled();
        });

        it('does not call the onPositionChange handler', () => {
          expect(this.props.onPositionChange).not.toHaveBeenCalled();
        });
      });

      describe('when scrolling down past the threshold', () => {
        beforeEach(() => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 90);
        });

        it('calls the onEnter handler', () => {
          expect(this.props.onEnter).
            toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
            });
        });

        it('does not call the onLeave handler', () => {
          expect(this.props.onLeave).not.toHaveBeenCalled();
        });

        it('calls the onPositionChange handler', () => {
          expect(this.props.onPositionChange).
            toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
            });
        });
      });
    });
  });

  describe('when the Waypoint is above the top', () => {
    beforeEach(() => {
      this.topSpacerHeight = 200;
      this.bottomSpacerHeight = 200;
      this.scrollable = this.subject();

      // Because of how we detect when a Waypoint is scrolled past without any
      // scroll event fired when it was visible, we need to reset callback
      // spies.
      scrollNodeTo(this.scrollable, 400);
      this.props.onEnter.calls.reset();
      this.props.onLeave.calls.reset();
      this.props.onPositionChange.calls.reset();
      scrollNodeTo(this.scrollable, 400);
    });

    it('does not call the onEnter handler', () => {
      expect(this.props.onEnter).not.toHaveBeenCalled();
    });

    it('does not call the onLeave handler', () => {
      expect(this.props.onLeave).not.toHaveBeenCalled();
    });

    it('does not call the onPositionChange handler', () => {
      expect(this.props.onPositionChange).not.toHaveBeenCalled();
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

      it('does not call the onPositionChange handler', () => {
        expect(this.props.onPositionChange).not.toHaveBeenCalled();
      });
    });

    describe('when scrolling up past the threshold', () => {
      beforeEach(() => {
        scrollNodeTo(this.scrollable, 200);
      });

      it('calls the onEnter handler', () => {
        expect(this.props.onEnter).
          toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.above,
            event: jasmine.any(Event),
          });
      });

      it('does not call the onLeave handler', () => {
        expect(this.props.onLeave).not.toHaveBeenCalled();
      });

      it('calls the onPositionChange handler', () => {
        expect(this.props.onPositionChange).
          toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.above,
            event: jasmine.any(Event),
          });
      });


      describe('when scrolling up past the waypoint', () => {
        beforeEach(() => {
          scrollNodeTo(this.scrollable, 99);
        });

        it('calls the onLeave handler', () => {
          expect(this.props.onLeave).
            toHaveBeenCalledWith({
              currentPosition: Waypoint.below,
              previousPosition: Waypoint.inside,
              event: jasmine.any(Event),
            });
        });

        it('does not call the onEnter handler again', () => {
          expect(this.props.onEnter.calls.count()).toBe(1);
        });

        it('calls the onPositionChange handler', () => {
          expect(this.props.onPositionChange).
            toHaveBeenCalledWith({
              currentPosition: Waypoint.below,
              previousPosition: Waypoint.inside,
              event: jasmine.any(Event),
            });
        });
      });
    });

    describe('when scrolling up quickly past the waypoint', () => {
      // If you scroll really fast, we might not get a scroll event when the
      // waypoint is in view. We will get a scroll event before going into view
      // though, and one after. We want to treat this as if the waypoint was
      // visible for a brief moment, and so we fire both onEnter and onLeave.
      beforeEach(() => {
        scrollNodeTo(this.scrollable, 0);
      });

      it('calls the onEnter handler', () => {
        expect(this.props.onEnter).
          toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.above,
            event: jasmine.any(Event),
          });
      });

      it('calls the onLeave handler', () => {
        expect(this.props.onLeave).
          toHaveBeenCalledWith({
            currentPosition: Waypoint.below,
            previousPosition: Waypoint.inside,
            event: jasmine.any(Event),
          });
      });

      it('calls the onPositionChange handler', () => {
        expect(this.props.onPositionChange).
          toHaveBeenCalledWith({
            currentPosition: Waypoint.below,
            previousPosition: Waypoint.above,
            event: jasmine.any(Event),
          });
      });
    });
  });

  describe('when the scrollable parent is not displayed', () => {
    it('calls the onLeave handler', () => {
      this.component = this.subject();
      const node = ReactDOM.findDOMNode(this.component);
      node.style.display = 'none';
      scrollNodeTo(this.component, 0);
      expect(this.props.onLeave).
      toHaveBeenCalledWith({
        currentPosition: Waypoint.invisible,
        previousPosition: Waypoint.inside,
        event: jasmine.any(Event),
      });
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
      this.subject();
      expect(this.props.onEnter).not.toHaveBeenCalled();
    });

    it('fires the onPositionChange handler on mount', () => {
      this.subject();
      expect(this.props.onPositionChange).
        toHaveBeenCalledWith({
          currentPosition: Waypoint.below,
          previousPosition: null,
          event: null,
        });
    });

    describe('when the Waypoint is in view', () => {
      beforeEach(() => {
        this.subject();
        scrollNodeTo(window, this.topSpacerHeight - window.innerHeight / 2);
      });

      it('fires the onEnter handler', () => {
        expect(this.props.onEnter).
          toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.below,
            event: jasmine.any(Event),
          });
      });

      it('fires the onPositionChange handler', () => {
        expect(this.props.onPositionChange).
          toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.below,
            event: jasmine.any(Event),
          });
      });
    });
  });

  describe('when the <html> is the scrollable parent', () => {
    beforeEach(() => {
      // Give the <html> an overflow style
      document.documentElement.style.overflow = 'auto';

      // Make the normal parent non-scrollable
      this.parentStyle = {};
    });

    afterEach(() => {
      delete document.documentElement.style.overflow;
    });

    it('does not throw an error', () => {
      expect(this.subject).not.toThrow();
    });
  });

  describe('when the waypoint is updated in the onEnter callback', () => {
    beforeEach(() => {
      const Wrapper = React.createClass({
        render() {
          return React.createElement('div',
            { style: { margin: window.innerHeight * 2 + 'px 0'} },
            React.createElement(Waypoint, {
              onEnter: () => {
                this.props.onEnter();
                this.forceUpdate();
              }
            })
          );
        },
      });

      this.subject = () => {
        return renderAttached(React.createElement(Wrapper, this.props));
      };
    });

    it('only calls onEnter once', () => {
      this.subject();
      scrollNodeTo(window, window.innerHeight);
      expect(this.props.onEnter.calls.count()).toBe(1);
    });
  });

  describe('when window is undefined', () => {
    beforeEach(() => {
      spyOn(Waypoint, 'getWindow').and.returnValue(undefined);
    });

    it('does not throw an error', () => {
      expect(this.subject).not.toThrow();
    });
  });

  describe('when the <body> itself has a margin', () => {
    beforeEach(() => {
      // document.body.style.marginTop = '0px';
      document.body.style.marginTop = '20px';
      document.body.style.position = 'relative';
      // this.topSpacerHeight = 20;

      // Make the spacers large enough to make the Waypoint render off-screen
      this.bottomSpacerHeight = window.innerHeight + 1000;

      // Make the normal parent non-scrollable
      this.parentStyle = {};

      this.subject();
    });

    afterEach(() => {
      document.body.style.marginTop = '';
      document.body.style.position = '';
    });

    it('calls the onEnter handler', () => {
      expect(this.props.onEnter).
        toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: null,
          event: null,
        });
    });

    it('does not call the onLeave handler', () => {
      expect(this.props.onLeave).not.toHaveBeenCalled();
    });

    it('calls the onPositionChange handler', () => {
      expect(this.props.onPositionChange).
        toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: null,
          event: null,
        });
    });

    describe('when scrolling while the waypoint is visible', () => {
      beforeEach(() => {
        this.props.onPositionChange.calls.reset();
        scrollNodeTo(window, 10);
      });

      it('does not call the onEnter handler again', () => {
        expect(this.props.onEnter.calls.count()).toBe(1);
      });

      it('does not call the onLeave handler', () => {
        expect(this.props.onLeave).not.toHaveBeenCalled();
      });

      it('does not call the onPositionChange handler', () => {
        expect(this.props.onPositionChange).not.toHaveBeenCalled();
      });

      describe('when scrolling past it', () => {
        beforeEach(() => {
          scrollNodeTo(window, 25);
        });

        it('the onLeave handler is called', () => {
          expect(this.props.onLeave).
            toHaveBeenCalledWith({
              currentPosition: Waypoint.above,
              previousPosition: Waypoint.inside,
              event: jasmine.any(Event),
            });
        });

        it('does not call the onEnter handler', () => {
          expect(this.props.onEnter.calls.count()).toBe(1);
        });

        it('the onPositionChange handler is called', () => {
          expect(this.props.onPositionChange).
            toHaveBeenCalledWith({
              currentPosition: Waypoint.above,
              previousPosition: Waypoint.inside,
              event: jasmine.any(Event),
            });
        });
      });
    });
  });

  describe('when using the legacy `scrollableParent` prop', () => {
    beforeEach(() => {
      this.props.scrollableParent = window;
    });

    it('throws a helpful error', () => {
      expect(this.subject).toThrowError(/changed name to `scrollableAncestor`/);
    });
  });
});
