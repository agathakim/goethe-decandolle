import React from 'react';
import {connect} from 'react-redux';
import * as actionCreators from '../actions';
import {Map} from 'immutable';
import {COLORS} from '../constants';

import Sankey from './sankey';
import Sunburst from './sunburst';
import TimeSeries from './time-series';
import WaffleBook from './waffle-book';
import Venn from './venn-diagram';

import ExampleLabelTable from '../constants/example-label-table.json';

class RootComponent extends React.Component {
  render() {
    const {
      showWafflebook,
      toggleWafflebookAndTimeseries
    } = this.props;
    return (
      <div>
      <h1>{'Comparison & visualization of the forms of scientific texts in the nineteenth century'}</h1>
      <h3>{'Case 1: Goethe and De Candolle'}</h3>
      <h5>Agatha Kim</h5>
      <div>DESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTION</div>
      {
        
        // <div><Venn data={this.props.vennData.toJS()}/></div>
      }
      <div>
        <h5>GOETHE - TEXT NAME</h5>
        <div className="flex-down">
            <div className="flex">
              <div className="flex-down">
                <Sunburst 
                  hoveredComment={this.props.hoveredComment}
                  data={this.props.sunburstData.toJS()}/>
                <div className="sentence-box">
                  <div>
                    {this.props.hoveredComment ? 
                      this.props.hoveredComment.sentence :
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
                    hoveredComment={this.props.hoveredComment}
                    setHoveredComment={this.props.setHoveredComment}
                    data={this.props.waffleBookData.toJS()}/>) :
                  (<TimeSeries data={this.props.timeSeriesData.toJS()}/>)
                }
            </div>
          </div>
        </div>

      </div>
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
                  background: COLORS[row['SuperCategory']] 
                }}>{`${row['SuperCategory']}`}</span></div>
              <div><i>Example from Goethe: </i>{`${row.Goethe}`}</div>
              <div><i>Example from De Candolle: </i>{`${row['De Candolle']}`}</div>
          </div>);
        })}
      </div>
    </div>
    )
  }
}

function mapStateToProps({base}) {
  return {
    sankeyData: base.get('sankeyData'),
    timeSeriesData: base.get('timeSeriesData'),
    sunburstData: base.get('sunburstData'),
    waffleBookData: base.get('waffleBookData'),
    vennData: base.get('vennData'),
    
    hoveredComment: base.get('hoveredComment'),
    lockedWaffle: base.get('lockedWaffle'),
    showWafflebook: base.get('showWafflebook')
  };
}

export default connect(mapStateToProps, actionCreators)(RootComponent);
