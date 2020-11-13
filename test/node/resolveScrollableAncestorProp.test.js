import resolveScrollableAncestorProp from '../../src/resolveScrollableAncestorProp';

describe('resolveScrollableAncestorProp()', () => {
  it('converts "window" into `global.window`', () => {
    global.window = {};

    expect(resolveScrollableAncestorProp('window')).toEqual(global.window);
  });

  it('passes other values through', () => {
    expect(resolveScrollableAncestorProp('foo')).toEqual('foo');
  });
});
