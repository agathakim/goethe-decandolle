import React from 'react';
import {connect} from 'react-redux';
import * as actionCreators from '../actions';
import {Map} from 'immutable';
import {COLORS} from '../constants';

import Sankey from './sankey';
import Sunburst from './sunburst';
import TimeSeries from './time-series';
import WaffleBook from './waffle-book';
import ExamplesTable from './examples-table';

const files = [
  {name: 'Goethe', filePrefix: 'Goethe'},
  {name: 'De Candolle 1', filePrefix: 'DC1'},
  {name: 'De Candolle 2', filePrefix: 'DC2'},
  {name: 'De Candolle 3', filePrefix: 'DC3'}
];

class RootComponent extends React.Component {
  componentDidMount(props) {
    // defaults to loading goethe
    this.props.getFile(this.props.selectedFile);
  }
  render() {
    const {
      hoveredComment,
      loading,
      showWafflebook,
      toggleWafflebookAndTimeseries,
      selectedFile
    } = this.props;

    return (
      <div>
        <div className="flex-down center">
          <h1>{'Comparison & visualization of the forms of scientific texts in the nineteenth century'}</h1>
          <h3>{'Case 1: Goethe and De Candolle'}</h3>
        </div>
        <h5>By Agatha Kim</h5>

        <div>'"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."'</div>

        <h5>Text selection</h5>
        <div className="flex">
        {
          files.map(({name, filePrefix}) => {
            const variableClass = selectedFile === 'filePrefix' ? 'selected-file' : '';
            const className = `file ${variableClass}`;
            return (<div 
              key={name} 
              onClick={() => this.props.getFile(filePrefix)}
              className={className}>
              {name}
            </div>)
          })
        }
        </div>


      {loading && <h1>LOADING</h1>}
      {!loading && <div>
        <h5>{files.find(({filePrefix}) => filePrefix === selectedFile).name}</h5>
        <div className="flex-down">
            <div className="flex">
              <div className="flex-down">
                <Sunburst 
                  hoveredComment={hoveredComment}
                  data={this.props.sunburstData.toJS()}/>
                <div className="sentence-box">
                  <div>
                    {hoveredComment ? 
                      hoveredComment.sentence :
                      'hover over grid to the right to select a sentence'}
                  </div>
                </div>
              </div>
            <div className="flex-down">
                <button onClick={toggleWafflebookAndTimeseries}>
                  {`Show ${showWafflebook ? 'TimeSeries' : 'Grid'}`}
                </button>
                {showWafflebook ? 
                  (<WaffleBook
                    toggleLock={this.props.toggleLock}
                    lockedWaffle={this.props.lockedWaffle}
                    hoveredComment={hoveredComment}
                    setHoveredComment={this.props.setHoveredComment}
                    data={this.props.waffleBookData.toJS()}/>) :
                  (<TimeSeries data={this.props.timeSeriesData.toJS()}/>)
                }
            </div>
          </div>
        </div>
        <ExamplesTable />
      </div>}
    </div>
    )
  }
}

function mapStateToProps({base}) {
  return {
    // data
    // sankeyData: base.get('sankeyData'),
    timeSeriesData: base.get('timeSeriesData'),
    sunburstData: base.get('sunburstData'),
    waffleBookData: base.get('waffleBookData'),
    vennData: base.get('vennData'),
    // not data
    hoveredComment: base.get('hoveredComment'),
    lockedWaffle: base.get('lockedWaffle'),
    showWafflebook: base.get('showWafflebook'),
    loading: base.get('loading'),
    selectedFile: base.get('selectedFile')
  };
}

export default connect(mapStateToProps, actionCreators)(RootComponent);
