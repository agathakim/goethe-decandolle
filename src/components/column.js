import React from 'react';
import BarChart from './barchart';
import Graph from './graph';
import Picker from './file-picker';
import StackedBarChart from './treemap';
import Matrix from './matrix';
import WaffleBook from './waffle';

import {
  files,
  DESCRIPTIONS,
  WAFFLE_WIDTH,
  COLORS_FOR_LEGEND,
} from '../constants';
import {
  getFile,
  prepBarChart,
  prepWaffleData,
  colorSentences,
  classnames,
  generateNodes,
  generateGraphLinks,
} from '../utils';

const VIS_MODE_GRAPH = 'graph';
const VIS_MODE_WAFFLE = 'waffle';
const VIS_MODE_MATRIX = 'matrix';

export default class Column extends React.Component {
  constructor(props) {
    super();
    this.state = {
      selectedFile: props.defaultSelection || files[0].filePrefix,
      barChartData: null,
      waffleBookData: null,
      loading: true,
      lockedWaffle: false,
      validColors: COLORS_FOR_LEGEND.reduce((acc, {color}) => {
        acc[color] = true;
        return acc;
      }, {}),
      visMode: VIS_MODE_GRAPH,
      useInclusive: true,
    };
    this.setAsyncState = this.setAsyncState.bind(this);
    this.updateData = this.updateData.bind(this);
  }
  componentDidMount() {
    const {useInclusive} = this.props;
    const {validColors} = this.state;
    this.updateData(this.state.selectedFile, validColors, useInclusive);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.calcIdx !== this.props.calcIdx) {
      const {validColors} = this.state;
      const {useInclusive} = this.props;
      this.updateData(this.state.selectedFile, validColors, useInclusive);
    }
  }

  setAsyncState(newState) {
    return new Promise(resolve => this.setState(newState, () => resolve()));
  }

  updateData(selectedFile, validColors, useInclusive) {
    // defaults to loading goethe
    this.setAsyncState({
      loading: true,
      selectedFile,
    }).then(() => {
      return getFile(selectedFile).then(
        ({sentenceClassifcations, numberedSents}) => {
          const waffleBookData = prepWaffleData(sentenceClassifcations);
          const graphNodes = generateNodes(
            waffleBookData,
            validColors,
            useInclusive,
          );
          const data = colorSentences(sentenceClassifcations);
          this.setState({
            data,
            numberedSents,
            barChartData: prepBarChart(data, validColors, useInclusive),
            waffleBookData,
            loading: false,
            graphNodes,
            graphLinks: generateGraphLinks(graphNodes),
            cooccuranceData: data.reduce((acc, row) => {
              const key = JSON.stringify(row.colors);
              acc[key] = (acc[key] || 0) + 1;
              return acc;
            }, {}),
          });
        },
      );
    });
  }

  renderModePicker() {
    const {visMode} = this.state;
    return (
      <div className="flex">
        <span>Visualization Mode:</span>
        {[VIS_MODE_GRAPH, VIS_MODE_WAFFLE, VIS_MODE_MATRIX].map(mode => {
          return (
            <div
              key={mode}
              onClick={() => this.setState({visMode: mode})}
              className={classnames({
                'selected-vis-mode': mode === visMode,
                'vis-mode': true,
              })}
            >
              {mode}
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const {showConnections, sendOffscreenNotAvailable} = this.props;
    const {
      barChartData,
      cooccuranceData,
      loading,
      selectedFile,
      graphNodes,
      graphLinks,
      validColors,
      visMode,
      waffleBookData,
      useInclusive,
    } = this.state;
    if (loading) {
      return (
        <div
          style={{
            width: `${WAFFLE_WIDTH}px`,
          }}
          className="flex-down center full-height"
        >
          <h1>LOADING</h1>
        </div>
      );
    }
    const changeAllSelection = setTo => () => {
      const newColors = Object.keys(validColors).reduce((acc, row) => {
        acc[row] = setTo;
        return acc;
      }, {});
      this.setState({validColors: newColors});
    };
    return (
      <div
        style={{
          width: `${WAFFLE_WIDTH}px`,
        }}
        className="flex-down"
      >
        <Picker
          validColors={validColors}
          selectedFile={selectedFile}
          useInclusive={useInclusive}
          onSelect={newPrefix =>
            this.updateData(newPrefix, validColors, useInclusive)
          }
          toggleColor={color => {
            const newColors = {...validColors};
            newColors[color] = !newColors[color];
            this.setState({validColors: newColors});
          }}
          updateGraph={() =>
            this.updateData(selectedFile, validColors, useInclusive)
          }
          toggleInclusiveExclusive={() => {
            this.setState({useInclusive: !useInclusive});
          }}
          unselectAll={changeAllSelection(false)}
          selectAll={changeAllSelection(true)}
        />
        <div className="flex-down descriptions">
          <h3 className="text-title">{DESCRIPTIONS[selectedFile].fullName}</h3>
          <p className="text-description">
            {DESCRIPTIONS[selectedFile].description}
          </p>
        </div>
        <div className="flex-down">
          <BarChart data={barChartData} />
          <StackedBarChart data={barChartData} />
        </div>
        <div className="flex-down margin-top">
          {this.renderModePicker()}
          {visMode === VIS_MODE_GRAPH && (
            <Graph
              cooccuranceData={cooccuranceData}
              showConnections={showConnections}
              nodes={graphNodes}
              links={graphLinks}
              prefix={selectedFile}
              sendOffscreenNotAvailable={sendOffscreenNotAvailable}
              barChartData={barChartData}
              getSentence={idx => this.state.numberedSents[idx]}
            />
          )}
          {visMode === VIS_MODE_WAFFLE && (
            <WaffleBook
              data={waffleBookData}
              cooccuranceData={cooccuranceData}
              barChartData={barChartData}
              getSentence={idx => this.state.numberedSents[idx]}
            />
          )}

          {visMode === VIS_MODE_MATRIX && <Matrix data={graphNodes} />}
        </div>
      </div>
    );
  }
}
