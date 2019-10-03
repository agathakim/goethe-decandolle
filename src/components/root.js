import React from 'react';
import ColumnVisualizations from './column';

export default class RootComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        {
          <div className="flex">
            <ColumnVisualizations />
            <ColumnVisualizations />
          </div>
        }
      </div>
    );
  }
}
