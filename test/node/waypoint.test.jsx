import React from 'react';
import renderer from 'react-test-renderer';

import { Waypoint } from '../../src/waypoint';

describe('<Waypoint>', () => {
  it('does not throw an error when in an environment without window', () => {
    expect(typeof window).toBe('undefined');
    expect(() => {
      renderer.create(<Waypoint />);
    }).not.toThrow();
  });
});
