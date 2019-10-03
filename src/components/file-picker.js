import React from 'react';
import {files} from '../constants';
export default class Picker extends React.Component {
  render() {
    const {onSelect, selectedFile} = this.props;
    return (
      <div>
        <h5>Text selection</h5>
        <div className="flex-down">
          <select
            onChange={({target: {value}}) => onSelect(value)}
            value={selectedFile}
          >
            {files.map(({name, filePrefix}) => {
              return (
                <option value={filePrefix} key={name}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  }
}
