import React from 'react';
import {COLORS_FOR_LEGEND} from '../constants';

export default class ColorLegend extends React.Component {
  render() {
    // TODO add styles so that these take up a smaller amount of space
    return (
      <div>
        {COLORS_FOR_LEGEND.map(({label, tag, color}) => {
          return (
            <div className="flex" key={tag}>
              <div
                style={{
                  backgroundColor: color,
                  height: '20px',
                  width: '20px',
                }}
              />
              <b>{tag}</b>:{label}
            </div>
          );
        })}
      </div>
    );
  }
}
