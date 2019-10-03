import React from 'react';
import ColumnVisualizations from './column';
import ColorLegend from './color-legend';
import {files} from '../constants';

export default class RootComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {};
  }

  render() {
    // TODO add styles so that these take up a smaller amount of space
    return (
      <div>
        <div className="flex">
          <ColumnVisualizations defaultSelection={files[0].filePrefix} />
          <div className="flex center full-height">
            <ColorLegend />
          </div>
          <ColumnVisualizations defaultSelection={files[1].filePrefix} />
        </div>
      </div>
    );
  }
}
