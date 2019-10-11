import React from 'react';
import ColumnVisualizations from './column';
import ColorLegend from './color-legend';
import {files} from '../constants';

export default class RootComponent extends React.Component {
  render() {
    return (
      <div className="app-container">
        <div className="flex">
          <ColumnVisualizations defaultSelection={files[0].filePrefix} />
          <div className="flex center full-height">
            <ColorLegend />
          </div>
          {<ColumnVisualizations defaultSelection={files[3].filePrefix} />}
        </div>
      </div>
    );
  }
}
