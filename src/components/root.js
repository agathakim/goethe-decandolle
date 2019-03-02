import React from 'react';
import {connect} from 'react-redux';
import * as actionCreators from '../actions';
import {Map} from 'immutable';
import Sankey from './sankey';
import Sunburst from './sunburst';
import TimeSeries from './time-series';
import WaffleBook from './waffle-book';

class RootComponent extends React.Component {
  render() {
    const {
      showWafflebook,
      toggleWafflebookAndTimeseries
    } = this.props;
    return (
      <div>
      <h1>TITLE TIEL TIEL</h1>
      <h3> VUE HACKATHON</h3>
      <h5>Agatha Kim & Andrew McNutt</h5>
      <div>DESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTION</div>
      {
        
        // <div><Sankey data={this.props.sankeyData.toJS()}/></div>
        // 
      }
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
    )
  }
}

function mapStateToProps({base}) {
  return {
    sankeyData: base.get('sankeyData'),
    timeSeriesData: base.get('timeSeriesData'),
    sunburstData: base.get('sunburstData'),
    waffleBookData: base.get('waffleBookData'),
    
    hoveredComment: base.get('hoveredComment'),
    lockedWaffle: base.get('lockedWaffle'),
    showWafflebook: base.get('showWafflebook')
  };
}

export default connect(mapStateToProps, actionCreators)(RootComponent);
