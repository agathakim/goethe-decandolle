import React from 'react';

import {COLORS_FOR_LEGEND} from '../constants';

export default class ColorLegend extends React.Component {
  render() {
    return (
      <div className="flex-down legend">
        <div className="medium-font grid">
          {COLORS_FOR_LEGEND.reduce((acc, {label, tag, color}) => {
            acc.push(
              <div
                className="legend-color grid-item"
                style={{backgroundColor: color, gridColumn: 1}}
                key={`legend-color-${color}`}
              />,
            );
            acc.push(
              <b style={{gridColumn: 2}} key={`tag-${tag}`}>
                {tag}
              </b>,
            );
            acc.push(
              <i style={{gridColumn: 3}} key={`name-${label}`}>
                {label}
              </i>,
            );
            return acc;
          }, [])}
        </div>
      </div>
    );
  }
}
