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



class RootComponent extends React.Component {
  componentDidMount(props) {
    // defaults to loading goethe
    this.props.getFile('Goethe');
  }
  render() {
    const {
      hoveredComment,
      loading,
      showWafflebook,
      toggleWafflebookAndTimeseries
    } = this.props;
    console.log(hoveredComment)
    return (
      <div>
        <h1>{'Comparison & visualization of the forms of scientific texts in the nineteenth century'}</h1>
        <h3>{'Case 1: Goethe and De Candolle'}</h3>
        <h5>Agatha Kim</h5>
      <div>DESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTION</div>
      {loading && <h1>LOADING</h1>}
      {!loading && <div>
        <h5>GOETHE - TEXT NAME</h5>
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
    sankeyData: base.get('sankeyData'),
    timeSeriesData: base.get('timeSeriesData'),
    sunburstData: base.get('sunburstData'),
    waffleBookData: base.get('waffleBookData'),
    vennData: base.get('vennData'),
    // not data
    hoveredComment: base.get('hoveredComment'),
    lockedWaffle: base.get('lockedWaffle'),
    showWafflebook: base.get('showWafflebook'),
    loading: base.get('loading')
  };
}

export default connect(mapStateToProps, actionCreators)(RootComponent);
