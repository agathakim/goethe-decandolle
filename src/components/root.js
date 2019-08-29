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
  {name: 'De Candolle 1 (DC1)', filePrefix: 'DC1'},
  {name: 'De Candolle 2 (DC2)', filePrefix: 'DC2'},
  {name: 'De Candolle 3 (DC3)', filePrefix: 'DC3'}
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
          <h3>{'Case 1: Goethe and De Candolle (DC1)'}</h3>
        </div>
        <h5>By Agatha Kim</h5>

        <div>'Left: Goethe, Metamorphosis of Plants
This work was originally published in 1790, but was translated into French only in 1829. After the famous public debate between the two leading French naturalists Georges Cuvier and Étienne Geoffroy Saint-Hilaire on the theories of animal structures and the methods and philosophies behind them, Goethe’s work was put in the spotlight, and was published in a French-German edition in 1831.
In this work, Goethe described plant growth in terms of serial homology, where a plant organ went through transformations (cotyledons, stem leaves, calyx, corolla, stamen, fruit, etc.) by alternately contracting and expanding its form. Goethe designated the leaf as the protean organ, or the Archetype of all the variations of plant forms. (The image to the right: the Archetypal plant as imagined by P. J. F. Turpin, 1837.) He considered these potential forms as equal in value—there was no hierarchy between the “regular” and “irregular” forms, which was a main disagreement between Goethe and De Candolle.
'</div>

<div>'Right: DC1: De Candolle, Essai sur les propriétés médicales des plantes (1804)
De Candolle’s goal in this work was to assert his Theory of Analogy, which argued that there was continuity between plant forms and properties. However, this theory asked one to look beyond the immediately visible plant forms because analogous plants could produce various effects while some non-analogous plants could produce similar effects on human. Instead, one had to distinguish which plant properties and structures were normative or accidental, as well as consider the modes in which plants produced their effects.
De Candolle promised that this theory would help get rid of the apparent anomalies and re-classify them correctly according to the natural order, which would benefit the practical uses of plant medicines, especially in the colonial world.
Although he argued that the environment could modify plant forms and properties and create the apparent anomalies, De Candolle remained silent, unlike Goethe or Saint-Hilaire, on the historical and evolutionary implications that these anomalies could offer.
'</div>


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
