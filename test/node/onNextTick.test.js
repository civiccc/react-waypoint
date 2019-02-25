import onNextTick from '../../src/onNextTick';

describe('onNextTick()', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('does not call callbacks immediately', () => {
    const called = [];

    onNextTick(() => {
      called.push(0);
    });

    onNextTick(() => {
      called.push(1);
    });

    onNextTick(() => {
      called.push(2);
    });

    expect(called).toEqual([]);

    jest.advanceTimersByTime(1);
  });

  it('calls callbacks in order', () => {
    const called = [];

    onNextTick(() => {
      called.push(0);
    });

    onNextTick(() => {
      called.push(1);
    });

    onNextTick(() => {
      called.push(2);
    });

    jest.advanceTimersByTime(1);

    expect(called).toEqual([0, 1, 2]);
  });

  it('does not call callbacks that have been unsubscribed', () => {
    const called = [];

    onNextTick(() => {
      called.push(0);
    });

    const unsub = onNextTick(() => {
      called.push(1);
    });

    onNextTick(() => {
      called.push(2);
    });

    unsub();

    jest.advanceTimersByTime(1);

    expect(called).toEqual([0, 2]);
  });

  it('does nothing if unsubscribe is called multiple times', () => {
    const called = [];

    onNextTick(() => {
      called.push(0);
    });

    const unsub = onNextTick(() => {
      called.push(1);
    });

    onNextTick(() => {
      called.push(2);
    });

    unsub();
    unsub();
    unsub();

    jest.advanceTimersByTime(1);

    expect(called).toEqual([0, 2]);
  });

  it('does nothing when unsubscribing a callback that has already been called', () => {
    const called = [];

    onNextTick(() => {
      called.push(0);
    });

    const unsub = onNextTick(() => {
      called.push(1);
    });

    onNextTick(() => {
      called.push(2);
    });

    jest.advanceTimersByTime(1);

    expect(called).toEqual([0, 1, 2]);

    onNextTick(() => {
      called.push(3);
    });

    onNextTick(() => {
      called.push(4);
    });

    onNextTick(() => {
      called.push(5);
    });

    unsub();

    jest.advanceTimersByTime(1);

    expect(called).toEqual([0, 1, 2, 3, 4, 5]);
  });
});
