/* eslint-disable react/no-multi-comp, react/no-render-return-value, react/no-find-dom-node */
import React from 'react';
import ReactDOM from 'react-dom';
import { Waypoint } from '../../src/waypoint';

import { errorMessage as refNotUsedErrorMessage } from '../../src/ensureRefIsUsedByChild';

let div;

function renderAttached(component) {
  div = document.createElement('div');
  document.body.appendChild(div);
  const renderedComponent = ReactDOM.render(component, div);
  return renderedComponent;
}

function scrollNodeTo(node, scrollTop) {
  if (node === window) {
    window.scroll(0, scrollTop);
  } else {
    // eslint-disable-next-line no-param-reassign
    node.scrollTop = scrollTop;
  }
  const event = document.createEvent('Event');
  event.initEvent('scroll', false, false);
  node.dispatchEvent(event);
}

describe('<Waypoint>', () => {
  beforeEach(() => {
    jasmine.clock().install();
    spyOn(console, 'log');
    this.props = {
      onEnter: jasmine.createSpy('onEnter'),
      onLeave: jasmine.createSpy('onLeave'),
      onPositionChange: jasmine.createSpy('onPositionChange'),
    };

    this.margin = 10;
    this.parentHeight = 100;

    this.parentStyle = {
      height: this.parentHeight,
      overflow: 'auto',
      position: 'relative',
      width: 100,
      margin: this.margin, // Normalize the space above the viewport.
    };

    this.topSpacerHeight = 0;
    this.bottomSpacerHeight = 0;

    this.subject = () => {
      const el = renderAttached(
        <div style={this.parentStyle}>
          <div style={{ height: this.topSpacerHeight }} />
          <Waypoint {...this.props} />
          <div style={{ height: this.bottomSpacerHeight }} />
        </div>,
      );

      jasmine.clock().tick(1);
      return el;
    };
  });

  afterEach(() => {
    if (div) {
      ReactDOM.unmountComponentAtNode(div);
    }
    scrollNodeTo(window, 0);
    jasmine.clock().uninstall();
  });

  it('logs to the console when called with debug = true', () => {
    this.props.debug = true;
    this.subject();
    expect(console.log).toHaveBeenCalled(); // eslint-disable-line no-console
  });

  describe('when the Waypoint is visible on mount', () => {
    beforeEach(() => {
      this.topSpacerHeight = 90;
      this.bottomSpacerHeight = 200;
      this.parentComponent = this.subject();
      this.scrollable = this.parentComponent;
    });

    it('does not log to the console', () => {
      // eslint-disable-next-line no-console
      expect(console.log).not.toHaveBeenCalled();
    });

    it('calls the onEnter handler', () => {
      expect(this.props.onEnter).toHaveBeenCalledWith({
        currentPosition: Waypoint.inside,
        previousPosition: undefined,
        event: null,
        waypointTop: this.margin + this.topSpacerHeight,
        waypointBottom: this.margin + this.topSpacerHeight,
        viewportTop: this.margin,
        viewportBottom: this.margin + this.parentHeight,
      });
    });

    it('calls the onPositionChange handler', () => {
      expect(this.props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: undefined,
          event: null,
          waypointTop: this.margin + this.topSpacerHeight,
          waypointBottom: this.margin + this.topSpacerHeight,
          viewportTop: this.margin,
          viewportBottom: this.margin + this.parentHeight,
        });
    });

    it('does not call the onLeave handler', () => {
      expect(this.props.onLeave).not.toHaveBeenCalled();
    });
  });

  describe('when the Waypoint is visible on mount and has topOffset < -100%', () => {
    beforeEach(() => {
      this.props.topOffset = '-200%';

      this.topSpacerHeight = 90;
      this.bottomSpacerHeight = 200;
      this.parentComponent = this.subject();
      this.scrollable = this.parentComponent;
    });

    it('calls the onEnter handler', () => {
      expect(this.props.onEnter).toHaveBeenCalledWith({
        currentPosition: Waypoint.inside,
        previousPosition: undefined,
        event: null,
        waypointTop: this.margin + this.topSpacerHeight,
        waypointBottom: this.margin + this.topSpacerHeight,
        viewportTop: this.margin - (this.parentHeight * 2),
        viewportBottom: this.margin + this.parentHeight,
      });
    });

    it('calls the onPositionChange handler', () => {
      expect(this.props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: undefined,
          event: null,
          waypointTop: this.margin + this.topSpacerHeight,
          waypointBottom: this.margin + this.topSpacerHeight,
          viewportTop: this.margin - (this.parentHeight * 2),
          viewportBottom: this.margin + this.parentHeight,
        });
    });

    it('does not call the onLeave handler', () => {
      expect(this.props.onLeave).not.toHaveBeenCalled();
    });
  });

  describe('when the Waypoint is visible on mount and has bottomOffset < -100%', () => {
    beforeEach(() => {
      this.props.bottomOffset = '-200%';

      this.topSpacerHeight = 90;
      this.bottomSpacerHeight = 200;
      this.parentComponent = this.subject();
      this.scrollable = this.parentComponent;
    });

    it('calls the onEnter handler', () => {
      expect(this.props.onEnter).toHaveBeenCalledWith({
        currentPosition: Waypoint.inside,
        previousPosition: undefined,
        event: null,
        waypointTop: this.margin + this.topSpacerHeight,
        waypointBottom: this.margin + this.topSpacerHeight,
        viewportTop: this.margin,
        viewportBottom: this.margin + (this.parentHeight * 3),
      });
    });

    it('calls the onPositionChange handler', () => {
      expect(this.props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: undefined,
          event: null,
          waypointTop: this.margin + this.topSpacerHeight,
          waypointBottom: this.margin + this.topSpacerHeight,
          viewportTop: this.margin,
          viewportBottom: this.margin + (this.parentHeight * 3),
        });
    });

    it('does not call the onLeave handler', () => {
      expect(this.props.onLeave).not.toHaveBeenCalled();
    });
  });

  describe('when the Waypoint is visible on mount and offsets < -100%', () => {
    beforeEach(() => {
      this.props.topOffset = '-200%';
      this.props.bottomOffset = '-200%';

      this.topSpacerHeight = 90;
      this.bottomSpacerHeight = 200;
      this.parentComponent = this.subject();
      this.scrollable = this.parentComponent;
    });

    it('calls the onEnter handler', () => {
      expect(this.props.onEnter).toHaveBeenCalledWith({
        currentPosition: Waypoint.inside,
        previousPosition: undefined,
        event: null,
        waypointTop: this.margin + this.topSpacerHeight,
        waypointBottom: this.margin + this.topSpacerHeight,
        viewportTop: this.margin - (this.parentHeight * 2),
        viewportBottom: this.margin + (this.parentHeight * 3),
      });
    });

    it('calls the onPositionChange handler', () => {
      expect(this.props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: undefined,
          event: null,
          waypointTop: this.margin + this.topSpacerHeight,
          waypointBottom: this.margin + this.topSpacerHeight,
          viewportTop: this.margin - (this.parentHeight * 2),
          viewportBottom: this.margin + (this.parentHeight * 3),
        });
    });

    it('does not call the onLeave handler', () => {
      expect(this.props.onLeave).not.toHaveBeenCalled();
    });
  });

  describe('when scrolling while the waypoint is visible', () => {
    beforeEach(() => {
      this.topSpacerHeight = 90;
      this.bottomSpacerHeight = 200;
      this.parentComponent = this.subject();
      this.scrollable = this.parentComponent;
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
  });

  describe('when scrolling past the waypoint while it is visible', () => {
    beforeEach(() => {
      this.topSpacerHeight = 90;
      this.bottomSpacerHeight = 200;
      this.parentComponent = this.subject();
      this.scrollable = this.parentComponent;
      scrollNodeTo(this.scrollable, this.topSpacerHeight + 10);
    });

    it('the onLeave handler is called', () => {
      expect(this.props.onLeave)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.above,
          previousPosition: Waypoint.inside,
          event: jasmine.any(Event),
          waypointTop: this.margin - 10,
          waypointBottom: this.margin - 10,
          viewportTop: this.margin,
          viewportBottom: this.margin + this.parentHeight,
        });
    });

    it('does not call the onEnter handler', () => {
      expect(this.props.onEnter.calls.count()).toBe(1);
    });

    it('the onPositionChange is called', () => {
      expect(this.props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.above,
          previousPosition: Waypoint.inside,
          event: jasmine.any(Event),
          waypointTop: this.margin - 10,
          waypointBottom: this.margin - 10,
          viewportTop: this.margin,
          viewportBottom: this.margin + this.parentHeight,
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
      expect(this.props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.below,
          previousPosition: undefined,
          event: null,
          waypointTop: this.margin + this.topSpacerHeight,
          waypointBottom: this.margin + this.topSpacerHeight,
          viewportTop: this.margin,
          viewportBottom: this.margin + this.parentHeight,
        });
    });

    describe('with children', () => {
      beforeEach(() => {
        this.childrenHeight = 80;
        this.props.children = (
          <div>
            <div style={{ height: this.childrenHeight / 2 }} />
            <div style={{ height: this.childrenHeight / 2 }} />
          </div>
        );
      });

      it('calls the onEnter handler when scrolling down far enough', () => {
        this.component = this.subject();
        this.props.onPositionChange.calls.reset();
        scrollNodeTo(this.component, 100);

        expect(this.props.onEnter)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.below,
            event: jasmine.any(Event),
            waypointTop: this.margin + this.topSpacerHeight - 100,
            waypointBottom: this.margin + this.topSpacerHeight - 100 + this.childrenHeight,
            viewportTop: this.margin,
            viewportBottom: this.margin + this.parentHeight,
          });
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

    it('calls the onEnter handler when scrolling down past the threshold', () => {
      scrollNodeTo(this.subject(), 100);

      expect(this.props.onEnter)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: Waypoint.below,
          event: jasmine.any(Event),
          waypointTop: this.margin + this.topSpacerHeight - 100,
          waypointBottom: this.margin + this.topSpacerHeight - 100,
          viewportTop: this.margin,
          viewportBottom: this.margin + this.parentHeight,
        });
    });

    it('calls the onPositionChange handler when scrolling down past the threshold', () => {
      scrollNodeTo(this.subject(), 100);

      expect(this.props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: Waypoint.below,
          event: jasmine.any(Event),
          waypointTop: this.margin + this.topSpacerHeight - 100,
          waypointBottom: this.margin + this.topSpacerHeight - 100,
          viewportTop: this.margin,
          viewportBottom: this.margin + this.parentHeight,
        });
    });

    it('does not call the onLeave handler when scrolling down past the threshold', () => {
      scrollNodeTo(this.subject(), 100);
      expect(this.props.onLeave).not.toHaveBeenCalled();
    });

    describe('when `fireOnRapidScroll` is disabled', () => {
      beforeEach(() => {
        this.props.fireOnRapidScroll = false;
      });

      it('calls the onEnter handler when scrolling down past the threshold', () => {
        scrollNodeTo(this.subject(), 100);

        expect(this.props.onEnter)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.below,
            event: jasmine.any(Event),
            waypointTop: this.margin + this.topSpacerHeight - 100,
            waypointBottom: this.margin + this.topSpacerHeight - 100,
            viewportTop: this.margin,
            viewportBottom: this.margin + this.parentHeight,
          });
      });

      it('calls the onPositionChange handler when scrolling down past the threshold', () => {
        scrollNodeTo(this.subject(), 100);

        expect(this.props.onPositionChange)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.below,
            event: jasmine.any(Event),
            waypointTop: this.margin + this.topSpacerHeight - 100,
            waypointBottom: this.margin + this.topSpacerHeight - 100,
            viewportTop: this.margin,
            viewportBottom: this.margin + this.parentHeight,
          });
      });

      it('does not call the onLeave handler when scrolling down past the threshold', () => {
        scrollNodeTo(this.subject(), 100);

        expect(this.props.onLeave).not.toHaveBeenCalled();
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
          scrollNodeTo(this.component, this.topSpacerHeight + this.bottomSpacerHeight);
        };
      });

      it('calls the onEnter handler', () => {
        this.scrollQuicklyPast();
        expect(this.props.onEnter)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.below,
            event: jasmine.any(Event),
            waypointTop: this.margin - this.bottomSpacerHeight + this.parentHeight,
            waypointBottom: this.margin - this.bottomSpacerHeight + this.parentHeight,
            viewportTop: this.margin,
            viewportBottom: this.margin + this.parentHeight,
          });
      });

      it('calls the onLeave handler', () => {
        this.scrollQuicklyPast();
        expect(this.props.onLeave)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.above,
            previousPosition: Waypoint.inside,
            event: jasmine.any(Event),
            waypointTop: this.margin - this.bottomSpacerHeight + this.parentHeight,
            waypointBottom: this.margin - this.bottomSpacerHeight + this.parentHeight,
            viewportTop: this.margin,
            viewportBottom: this.margin + this.parentHeight,
          });
      });

      it('calls the onPositionChange handler', () => {
        this.scrollQuicklyPast();
        expect(this.props.onPositionChange)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.above,
            previousPosition: Waypoint.below,
            event: jasmine.any(Event),
            waypointTop: this.margin - this.bottomSpacerHeight + this.parentHeight,
            waypointBottom: this.margin - this.bottomSpacerHeight + this.parentHeight,
            viewportTop: this.margin,
            viewportBottom: this.margin + this.parentHeight,
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
          expect(this.props.onPositionChange)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.above,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
              waypointTop: this.margin - this.bottomSpacerHeight + this.parentHeight,
              waypointBottom: this.margin - this.bottomSpacerHeight + this.parentHeight,
              viewportTop: this.margin,
              viewportBottom: this.margin + this.parentHeight,
            });
        });
      });
    });

    describe('with a non-zero topOffset', () => {
      describe('and the topOffset is passed as a percentage', () => {
        beforeEach(() => {
          this.props.topOffset = '-10%';
        });

        it('calls the onLeave handler when scrolling down past the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 211);

          expect(this.props.onLeave)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.above,
              previousPosition: Waypoint.inside,
              event: jasmine.any(Event),
              waypointTop: this.margin + this.topSpacerHeight - 211,
              waypointBottom: this.margin + this.topSpacerHeight - 211,
              viewportTop: this.margin + this.parentHeight * -0.1,
              viewportBottom: this.margin + this.parentHeight,
            });
        });
      });
    });

    describe('with a non-zero bottomOffset', () => {
      describe('and the bottomOffset is passed as a percentage', () => {
        beforeEach(() => {
          this.props.bottomOffset = '-10%';
        });

        it('does not call the onEnter handler when scrolling down near the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 89);

          expect(this.props.onEnter).not.toHaveBeenCalled();
        });

        it('does not call the onLeave handler when scrolling down near the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 89);

          expect(this.props.onLeave).not.toHaveBeenCalled();
        });

        it('does not call onPositionChange handler when scrolling down near bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 89);

          expect(this.props.onPositionChange).not.toHaveBeenCalled();
        });

        it('calls the onEnter handler when scrolling down past the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 90);

          expect(this.props.onEnter)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
              waypointTop: this.margin + this.topSpacerHeight - 90,
              waypointBottom: this.margin + this.topSpacerHeight - 90,
              viewportTop: this.margin,
              viewportBottom: this.margin + Math.floor(this.parentHeight * 1.1),
            });
        });

        it('does not call the onLeave handler when scrolling down past the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 90);

          expect(this.props.onLeave).not.toHaveBeenCalled();
        });

        it('calls the onPositionChange handler when scrolling down past the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 90);

          expect(this.props.onPositionChange)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
              waypointTop: this.margin + this.topSpacerHeight - 90,
              waypointBottom: this.margin + this.topSpacerHeight - 90,
              viewportTop: this.margin,
              viewportBottom: this.margin + Math.floor(this.parentHeight * 1.1),
            });
        });
      });

      describe('and the bottom offset is passed as a numeric string', () => {
        beforeEach(() => {
          this.props.bottomOffset = '-10';
        });

        it('does not call the onEnter handler when scrolling down near the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 89);

          expect(this.props.onEnter).not.toHaveBeenCalled();
        });

        it('does not call the onLeave handler when scrolling down near the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 89);

          expect(this.props.onLeave).not.toHaveBeenCalled();
        });

        it('does not call onPositionChange handler when scrolling down near bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 89);

          expect(this.props.onPositionChange).not.toHaveBeenCalled();
        });

        it('calls the onEnter handler when scrolling down past the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 90);

          expect(this.props.onEnter)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
              waypointTop: this.margin + this.topSpacerHeight - 90,
              waypointBottom: this.margin + this.topSpacerHeight - 90,
              viewportTop: this.margin,
              viewportBottom: this.margin + this.parentHeight + 10,
            });
        });

        it('does not call the onLeave handler when scrolling down past the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 90);

          expect(this.props.onLeave).not.toHaveBeenCalled();
        });

        it('calls the onPositionChange handler when scrolling down past the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 90);

          expect(this.props.onPositionChange)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
              waypointTop: this.margin + this.topSpacerHeight - 90,
              waypointBottom: this.margin + this.topSpacerHeight - 90,
              viewportTop: this.margin,
              viewportBottom: this.margin + this.parentHeight + 10,
            });
        });
      });

      describe('and the bottom offset is passed as a pixel string', () => {
        beforeEach(() => {
          this.props.bottomOffset = '-10px';
        });

        it('does not call the onEnter handler when scrolling down near the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 89);

          expect(this.props.onEnter).not.toHaveBeenCalled();
        });

        it('does not call the onLeave handler when scrolling down near the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 89);

          expect(this.props.onLeave).not.toHaveBeenCalled();
        });

        it('does not call onPositionChange handler when scrolling down near bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 89);

          expect(this.props.onPositionChange).not.toHaveBeenCalled();
        });

        it('calls the onEnter handler when scrolling down past the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 90);

          expect(this.props.onEnter)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
              waypointTop: this.margin + this.topSpacerHeight - 90,
              waypointBottom: this.margin + this.topSpacerHeight - 90,
              viewportTop: this.margin,
              viewportBottom: this.margin + this.parentHeight + 10,
            });
        });

        it('does not call the onLeave handler when scrolling down past the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 90);

          expect(this.props.onLeave).not.toHaveBeenCalled();
        });

        it('calls the onPositionChange handler when scrolling down past the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 90);

          expect(this.props.onPositionChange)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
              waypointTop: this.margin + this.topSpacerHeight - 90,
              waypointBottom: this.margin + this.topSpacerHeight - 90,
              viewportTop: this.margin,
              viewportBottom: this.margin + this.parentHeight + 10,
            });
        });
      });

      describe('and the bottom offset is passed as a number', () => {
        beforeEach(() => {
          this.props.bottomOffset = -10;
        });

        it('does not call the onEnter handler when scrolling down near the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 89);

          expect(this.props.onEnter).not.toHaveBeenCalled();
        });

        it('does not call the onLeave handler when scrolling down near the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 89);

          expect(this.props.onLeave).not.toHaveBeenCalled();
        });

        it('does not call onPositionChange handler when scrolling down near bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 89);

          expect(this.props.onPositionChange).not.toHaveBeenCalled();
        });

        it('calls the onEnter handler when scrolling down past the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 90);

          expect(this.props.onEnter)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
              waypointTop: this.margin + this.topSpacerHeight - 90,
              waypointBottom: this.margin + this.topSpacerHeight - 90,
              viewportTop: this.margin,
              viewportBottom: this.margin + this.parentHeight + 10,
            });
        });

        it('does not call the onLeave handler when scrolling down past the bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 90);

          expect(this.props.onLeave).not.toHaveBeenCalled();
        });

        it('calls onPositionChange handler when scrolling down past bottom offset', () => {
          this.component = this.subject();
          this.props.onPositionChange.calls.reset();
          scrollNodeTo(this.component, 90);

          expect(this.props.onPositionChange)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
              waypointTop: this.margin + this.topSpacerHeight - 90,
              waypointBottom: this.margin + this.topSpacerHeight - 90,
              viewportTop: this.margin,
              viewportBottom: this.margin + this.parentHeight + 10,
            });
        });
      });
    });
  });

  describe('when the Waypoint has children', () => {
    it('does not throw with a DOM Element as a child', () => {
      this.props.children = <div />;
      expect(this.subject).not.toThrow();
    });

    it('does not throw with a Stateful Component as a child', () => {
      class StatefulComponent extends React.Component {
        render() {
          const { innerRef } = this.props;
          return <div ref={innerRef} />;
        }
      }

      this.props.children = <StatefulComponent />;
      expect(this.subject).not.toThrow();
    });

    it('errors when a Stateful Component does not provide ref to Waypoint', () => {
      // eslint-disable-next-line react/prefer-stateless-function
      class StatefulComponent extends React.Component {
        render() {
          return <div />;
        }
      }

      this.props.children = <StatefulComponent />;
      expect(this.subject).toThrowError(refNotUsedErrorMessage);
    });

    it('does not throw with a Stateless Component as a child', () => {
      const StatelessComponent = ({ innerRef }) => <div ref={innerRef} />;

      this.props.children = <StatelessComponent />;
      expect(this.subject).not.toThrow();
    });

    it('errors when a Stateless Component does not provide ref to Waypoint', () => {
      const StatelessComponent = () => <div />;

      this.props.children = <StatelessComponent />;
      expect(this.subject).toThrowError(refNotUsedErrorMessage);
    });
  });

  describe('when the Waypoint has children and is above the top', () => {
    beforeEach(() => {
      this.topSpacerHeight = 200;
      this.bottomSpacerHeight = 200;
      this.childrenHeight = 100;
      this.props.children = <div style={{ height: this.childrenHeight }} />;
      this.scrollable = this.subject();

      // Because of how we detect when a Waypoint is scrolled past without any
      // scroll event fired when it was visible, we need to reset callback
      // spies.
      scrollNodeTo(this.scrollable, 400);
      this.props.onEnter.calls.reset();
      this.props.onLeave.calls.reset();
      scrollNodeTo(this.scrollable, 400);
    });

    it('does not call the onEnter handler', () => {
      expect(this.props.onEnter).not.toHaveBeenCalled();
    });

    it('does not call the onLeave handler', () => {
      expect(this.props.onLeave).not.toHaveBeenCalled();
    });

    it('calls the onEnter handler when scrolled back up just past the bottom', () => {
      scrollNodeTo(this.scrollable, this.topSpacerHeight + 50);

      expect(this.props.onEnter)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: Waypoint.above,
          event: jasmine.any(Event),
          waypointTop: -40,
          waypointBottom: -40 + this.childrenHeight,
          viewportTop: this.margin,
          viewportBottom: this.margin + this.parentHeight,
        });
    });

    it('does not call the onLeave handler when scrolled back up just past the bottom', () => {
      scrollNodeTo(this.scrollable, this.topSpacerHeight + 50);

      expect(this.props.onLeave).not.toHaveBeenCalled();
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

    it('does not call the onEnter handler when scrolling up not past the threshold', () => {
      scrollNodeTo(this.scrollable, 201);

      expect(this.props.onEnter).not.toHaveBeenCalled();
    });

    it('does not call the onLeave handler when scrolling up not past the threshold', () => {
      scrollNodeTo(this.scrollable, 201);

      expect(this.props.onLeave).not.toHaveBeenCalled();
    });

    it('does not call onPositionChange handler when scrolling up not past the threshold', () => {
      scrollNodeTo(this.scrollable, 201);

      expect(this.props.onPositionChange).not.toHaveBeenCalled();
    });

    describe('when scrolling up past the threshold', () => {
      beforeEach(() => {
        scrollNodeTo(this.scrollable, 200);
      });

      it('calls the onEnter handler', () => {
        expect(this.props.onEnter)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.above,
            event: jasmine.any(Event),
            waypointTop: this.margin + this.topSpacerHeight - 200,
            waypointBottom: this.margin + this.topSpacerHeight - 200,
            viewportTop: this.margin,
            viewportBottom: this.margin + this.parentHeight,
          });
      });

      it('does not call the onLeave handler', () => {
        expect(this.props.onLeave).not.toHaveBeenCalled();
      });

      it('calls the onPositionChange handler', () => {
        expect(this.props.onPositionChange)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.above,
            event: jasmine.any(Event),
            waypointTop: this.margin + this.topSpacerHeight - 200,
            waypointBottom: this.margin + this.topSpacerHeight - 200,
            viewportTop: this.margin,
            viewportBottom: this.margin + this.parentHeight,
          });
      });

      it('calls the onLeave handler when scrolling up past the waypoint', () => {
        scrollNodeTo(this.scrollable, 99);

        expect(this.props.onLeave)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.below,
            previousPosition: Waypoint.inside,
            event: jasmine.any(Event),
            waypointTop: this.margin + this.topSpacerHeight - 99,
            waypointBottom: this.margin + this.topSpacerHeight - 99,
            viewportTop: this.margin,
            viewportBottom: this.margin + this.parentHeight,
          });
      });

      it('does not call the onEnter handler again when scrolling up past the waypoint', () => {
        scrollNodeTo(this.scrollable, 99);

        expect(this.props.onEnter.calls.count()).toBe(1);
      });

      it('calls the onPositionChange handler when scrolling up past the waypoint', () => {
        scrollNodeTo(this.scrollable, 99);

        expect(this.props.onPositionChange)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.below,
            previousPosition: Waypoint.inside,
            event: jasmine.any(Event),
            waypointTop: this.margin + this.topSpacerHeight - 99,
            waypointBottom: this.margin + this.topSpacerHeight - 99,
            viewportTop: this.margin,
            viewportBottom: this.margin + this.parentHeight,
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
        expect(this.props.onEnter)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.above,
            event: jasmine.any(Event),
            waypointTop: this.margin + this.topSpacerHeight,
            waypointBottom: this.margin + this.topSpacerHeight,
            viewportTop: this.margin,
            viewportBottom: this.margin + this.parentHeight,
          });
      });

      it('calls the onLeave handler', () => {
        expect(this.props.onLeave)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.below,
            previousPosition: Waypoint.inside,
            event: jasmine.any(Event),
            waypointTop: this.margin + this.topSpacerHeight,
            waypointBottom: this.margin + this.topSpacerHeight,
            viewportTop: this.margin,
            viewportBottom: this.margin + this.parentHeight,
          });
      });

      it('calls the onPositionChange handler', () => {
        expect(this.props.onPositionChange)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.below,
            previousPosition: Waypoint.above,
            event: jasmine.any(Event),
            waypointTop: this.margin + this.topSpacerHeight,
            waypointBottom: this.margin + this.topSpacerHeight,
            viewportTop: this.margin,
            viewportBottom: this.margin + this.parentHeight,
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
      expect(this.props.onLeave)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.invisible,
          previousPosition: Waypoint.inside,
          event: jasmine.any(Event),
          waypointTop: 0,
          waypointBottom: 0,
          viewportTop: 0,
          viewportBottom: 0,
        });
    });
  });

  describe('when the window is the scrollable parent', () => {
    beforeEach(() => {
      // Make the normal parent non-scrollable
      this.parentStyle.height = 'auto';
      this.parentStyle.overflow = 'visible';

      // This is only here to try and confuse the _findScrollableAncestor code.
      document.body.style.overflow = 'auto';

      // Make the spacers large enough to make the Waypoint render off-screen
      this.topSpacerHeight = window.innerHeight + 1000;
      this.bottomSpacerHeight = 1000;
    });

    afterEach(() => {
      // Reset body style
      document.body.style.overflow = '';
    });

    it('does not fire the onEnter handler on mount', () => {
      this.subject();
      expect(this.props.onEnter).not.toHaveBeenCalled();
    });

    it('fires the onPositionChange handler on mount', () => {
      this.subject();
      expect(this.props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.below,
          previousPosition: undefined,
          event: null,
          waypointTop: this.margin + this.topSpacerHeight,
          waypointBottom: this.margin + this.topSpacerHeight,
          viewportTop: 0,
          viewportBottom: window.innerHeight,
        });
    });

    it('fires the onEnter handler when the Waypoint is in view', () => {
      this.subject();
      scrollNodeTo(window, this.topSpacerHeight - window.innerHeight / 2);

      expect(this.props.onEnter)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: Waypoint.below,
          event: jasmine.any(Event),
          waypointTop: this.margin + Math.ceil(window.innerHeight / 2),
          waypointBottom: this.margin + Math.ceil(window.innerHeight / 2),
          viewportTop: 0,
          viewportBottom: window.innerHeight,
        });
    });

    it('fires the onPositionChange handler when the Waypoint is in view', () => {
      this.subject();
      scrollNodeTo(window, this.topSpacerHeight - window.innerHeight / 2);

      expect(this.props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: Waypoint.below,
          event: jasmine.any(Event),
          waypointTop: this.margin + Math.ceil(window.innerHeight / 2),
          waypointBottom: this.margin + Math.ceil(window.innerHeight / 2),
          viewportTop: 0,
          viewportBottom: window.innerHeight,
        });
    });
  });

  it('does not throw an error when the <html> is the scrollable parent', () => {
    // Give the <html> an overflow style
    document.documentElement.style.overflow = 'auto';

    // Make the normal parent non-scrollable
    this.parentStyle.height = 'auto';
    this.parentStyle.overflow = 'visible';

    expect(this.subject).not.toThrow();

    delete document.documentElement.style.overflow;
  });

  describe('when the waypoint is updated in the onEnter callback', () => {
    beforeEach(() => {
      class Wrapper extends React.Component {
        render() {
          const doOnEnter = () => {
            const { onEnter } = this.props;
            onEnter();
            this.forceUpdate();
          };

          return (
            <div style={{ margin: `${window.innerHeight * 2}px 0` }}>
              <Waypoint onEnter={doOnEnter} />
            </div>
          );
        }
      }

      this.subject = () => renderAttached(<Wrapper {...this.props} />);
    });

    it('only calls onEnter once', () => {
      this.subject();

      return new Promise((resolve) => {
        setTimeout(() => {
          scrollNodeTo(window, window.innerHeight);
          expect(this.props.onEnter.calls.count()).toBe(1);
          resolve();
        });
      });
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
      expect(this.props.onEnter)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: undefined,
          event: null,
          waypointTop: 20 + this.topSpacerHeight,
          waypointBottom: 20 + this.topSpacerHeight,
          viewportTop: 0,
          viewportBottom: window.innerHeight,
        });
    });

    it('does not call the onLeave handler', () => {
      expect(this.props.onLeave).not.toHaveBeenCalled();
    });

    it('calls the onPositionChange handler', () => {
      expect(this.props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: undefined,
          event: null,
          waypointTop: 20 + this.topSpacerHeight,
          waypointBottom: 20 + this.topSpacerHeight,
          viewportTop: 0,
          viewportBottom: window.innerHeight,
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

      it('the onLeave handler is called when scrolling past the waypoint', () => {
        scrollNodeTo(window, 25);

        expect(this.props.onLeave)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.above,
            previousPosition: Waypoint.inside,
            event: jasmine.any(Event),
            waypointTop: 20 + this.topSpacerHeight - 25,
            waypointBottom: 20 + this.topSpacerHeight - 25,
            viewportTop: 0,
            viewportBottom: window.innerHeight,
          });
      });

      it('does not call the onEnter handler when scrolling past the waypoint', () => {
        scrollNodeTo(window, 25);

        expect(this.props.onEnter.calls.count()).toBe(1);
      });

      it('the onPositionChange handler is called when scrolling past the waypoint', () => {
        scrollNodeTo(window, 25);

        expect(this.props.onPositionChange)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.above,
            previousPosition: Waypoint.inside,
            event: jasmine.any(Event),
            waypointTop: 20 + this.topSpacerHeight - 25,
            waypointBottom: 20 + this.topSpacerHeight - 25,
            viewportTop: 0,
            viewportBottom: window.innerHeight,
          });
      });
    });
  });
});

// smoke tests for horizontal scrolling
function scrollNodeToHorizontal(node, scrollLeft) {
  if (node === window) {
    window.scroll(scrollLeft, 0);
  } else {
    // eslint-disable-next-line no-param-reassign
    node.scrollLeft = scrollLeft;
  }
  const event = document.createEvent('Event');
  event.initEvent('scroll', false, false);
  node.dispatchEvent(event);
}

describe('<Waypoint> Horizontal', () => {
  beforeEach(() => {
    jasmine.clock().install();
    document.body.style.margin = 'auto'; // should be no horizontal margin

    this.props = {
      onEnter: jasmine.createSpy('onEnter'),
      onLeave: jasmine.createSpy('onLeave'),
      horizontal: true,
    };

    this.margin = 10;
    this.parentWidth = 100;

    this.parentStyle = {
      height: 100,
      overflow: 'auto',
      whiteSpace: 'nowrap',
      width: this.parentWidth,
      margin: this.margin, // Normalize the space left of the viewport.
    };

    this.leftSpacerWidth = 0;
    this.rightSpacerWidth = 0;

    this.subject = () => {
      const el = renderAttached(
        <div style={this.parentStyle}>
          <div style={{ width: this.leftSpacerWidth, display: 'inline-block' }} />
          <Waypoint {...this.props} />
          <div style={{ width: this.rightSpacerWidth, display: 'inline-block' }} />
        </div>,
      );

      jasmine.clock().tick(1);
      return el;
    };
  });

  afterEach(() => {
    if (div) {
      ReactDOM.unmountComponentAtNode(div);
    }
    scrollNodeToHorizontal(window, 0);
    jasmine.clock().uninstall();
  });

  describe('when a div is the scrollable ancestor', () => {
    it('calls the onEnter handler when the Waypoint is visible on mount', () => {
      this.subject();

      expect(this.props.onEnter).toHaveBeenCalledWith({
        currentPosition: Waypoint.inside,
        previousPosition: undefined,
        event: null,
        waypointTop: this.margin + this.leftSpacerWidth,
        waypointBottom: this.margin + this.leftSpacerWidth,
        viewportTop: this.margin,
        viewportBottom: this.margin + this.parentWidth,
      });
    });

    it('does not call the onEnter handler when the Waypoint is not visible on mount', () => {
      this.leftSpacerWidth = 300;
      this.subject();
      expect(this.props.onEnter).not.toHaveBeenCalled();
    });
  });

  describe('when the window is the scrollable ancestor', () => {
    beforeEach(() => {
      delete this.parentStyle.overflow;
      delete this.parentStyle.width;
    });

    it('calls the onEnter handler when the Waypoint is visible on mount', () => {
      this.subject();
      expect(this.props.onEnter).toHaveBeenCalled();
    });

    describe('when the Waypoint is not visible on mount', () => {
      beforeEach(() => {
        this.leftSpacerWidth = window.innerWidth * 2;
        this.subject();
      });

      it('does not call the onEnter handler', () => {
        expect(this.props.onEnter).not.toHaveBeenCalled();
      });

      describe('when scrolled sideways to make the waypoint visible', () => {
        beforeEach(() => {
          scrollNodeToHorizontal(window, window.innerWidth + 100);
        });

        it('calls the onEnter handler', () => {
          expect(this.props.onEnter).toHaveBeenCalled();
        });

        it('does not call the onLeave handler', () => {
          expect(this.props.onLeave).not.toHaveBeenCalled();
        });

        it('does not call the onEnter handler when scrolled back to initial position', () => {
          this.props.onEnter.calls.reset();
          scrollNodeToHorizontal(window, 0);

          expect(this.props.onEnter).not.toHaveBeenCalled();
        });

        it('calls the onLeave handler when scrolled back to initial position', () => {
          this.props.onEnter.calls.reset();
          scrollNodeToHorizontal(window, 0);

          expect(this.props.onLeave).toHaveBeenCalled();
        });
      });
    });
  });
});
