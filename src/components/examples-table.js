import React from 'react';
import ExampleLabelTable from '../constants/example-label-table.json';
import {COLORS} from '../constants';

export default class ExamplesTable extends React.PureComponent {
  render() {

    return (
      <div className="examples-table">
        {ExampleLabelTable.map(row => {
          return (<div
            className="flex-down small-font"
            key={row['Individual Category']}>
            <div><b>CATEGORY:</b>
              <span style={{
                background: COLORS[row['Individual Category']]
              }}>{`${row['Individual Category']}`}</span></div>
            <div><b>SUPER CATEGORY:</b>
              <span style={{
                background: COLORS[row.SuperCategory]
              }}>{`${row.SuperCategory}`}</span></div>
            <div><i>Example from Goethe: </i>{`${row.Goethe}`}</div>
            <div><i>Example from De Candolle: </i>{`${row['De Candolle']}`}</div>
          </div>);
        })}
      </div>
    );
  }
}
