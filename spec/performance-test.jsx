import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Waypoint from '../src/waypoint';

const WAYPOINT_COUNT = 1000;

function logSomething(num) {
  // eslint-disable-next-line no-console
  console.log('<Waypoint>', num);
}

class PerformanceTest extends Component {
  render() {
    const elements = [];
    for (let i = 0; i < WAYPOINT_COUNT; i++) {
      elements.push(
        <div key={i}>
          <h2>Container {i}</h2>
          <div
            style={{
              height: 300,
              backgroundColor: '#f0f0f0',
              borderBottom: '1px solid #ccc',
            }}
          />
          <Waypoint onEnter={logSomething.bind(null, i)} />
        </div>
      );
    }
    return (
      <div>
        {elements}
      </div>
    );
  }
}

ReactDOM.render(
  <PerformanceTest/>,
  document.getElementById('app')
);
