var React = require('react');
var Utils = require('support/utils');
var Waypoint = require('components/waypoint');
var _ = require('underscore');

var scrollNodeTo = function(node, scrollTop) {
  node.scrollTop = scrollTop;
  var event = document.createEvent('Event');
  event.initEvent('scroll');
  node.dispatchEvent(event);
};

describe('Waypoint', () => {
  beforeEach(() => {
    // Make _.throttle synchronous
    spyOn(_, 'throttle').and.callFake((callback) => {
      return callback;
    });
  });

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

    this.subject = () => Utils.renderAttached(
      <div style={this.parentStyle}>
        <div style={{ height: this.topSpacerHeight }}/>
        <Waypoint {...this.props} />
        <div style={{ height: this.bottomSpacerHeight }}/>
      </div>
    );
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
});
