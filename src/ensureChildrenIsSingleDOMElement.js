import React from 'react';

import isDOMElement from './isDOMElement';

/**
 * Raise an error if "children" isn't a single DOM Element
 *
 * @param {React.element|null} children
 * @return {undefined}
 */
export default function ensureChildrenIsSingleDOMElement(children) {
  if (children) {
    React.Children.only(children);

    if (!isDOMElement(children)) {
      throw new Error(
        'You must wrap any Component Elements passed to Waypoint in a DOM Element (eg; a <div>).'
      );
    }
  }
}
