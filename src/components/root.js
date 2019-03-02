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
    // console.log(this.props.timeSeriesData.toJS())
    return (
      <div>
      <h1>TITLE TIEL TIEL</h1>
      <h3> VUE HACKATHON</h3>
      <h5>Agatha Kim & Andrew McNutt</h5>
      <div>DESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTION</div>
      {
        
        // <div><Sankey data={this.props.data.toJS()}/></div>
        // <TimeSeries data={this.props.timeSeriesData.toJS()}/>
      }
      <Sunburst data={this.props.sunburstData.toJS()}/>
      <WaffleBook data={this.props.waffleBookData.toJS()}/>
      </div>
    )
  }
}

function mapStateToProps({base}) {
  return {
    data: base.get('data'),
    timeSeriesData: base.get('timeSeriesData'),
    sunburstData: base.get('sunburstData'),
    waffleBookData: base.get('waffleBookData')
  };
}

export default connect(mapStateToProps, actionCreators)(RootComponent);
