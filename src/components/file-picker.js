import React from 'react';
import {files, COLORS_FOR_LEGEND} from '../constants';
export default class Picker extends React.Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
    };
  }

  renderModal() {
    const {
      onSelect,
      selectedFile,
      validColors,
      unselectAll,
      selectAll,
      toggleColor,
      updateGraph,
    } = this.props;

    return (
      <div className="modal">
        <h3> Select Text </h3>
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
        <h3> Select allowed categories </h3>
        {COLORS_FOR_LEGEND.map(({label, color}) => {
          return (
            <div key={`${label}-checkbox`}>
              <label className="container flex">
                <input
                  onChange={() => toggleColor(color)}
                  type="checkbox"
                  checked={validColors[color]}
                />
                <div
                  className="legend-color"
                  style={{backgroundColor: color}}
                />
                <span className="checkmark">{label}</span>
              </label>
            </div>
          );
        })}
        <div className="flex">
          <button onClick={selectAll}> Select All </button>
          <button onClick={unselectAll}> Unselect All </button>
          <button onClick={updateGraph}>Update Graph</button>
        </div>
      </div>
    );
  }
  render() {
    const {modalOpen} = this.state;

    return (
      <div className="flex">
        <div
          className="text-control-button"
          onClick={() => this.setState({modalOpen: true})}
        >
          Change Text Selection
        </div>
        {modalOpen && (
          <div
            className="modal-escape"
            onClick={() => this.setState({modalOpen: false})}
          />
        )}
        <div className="modal-container">{modalOpen && this.renderModal()}</div>
      </div>
    );
  }
}
