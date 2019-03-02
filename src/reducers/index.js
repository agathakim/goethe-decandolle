import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import Immutable from 'immutable';

import {
  generateCombinationCounts,
  prepTimeSeriesData,
  prepSunburst,
  prepWaffleData
} from './data-analysis-scripts';
import GoetheNumberedSentences from '../constants/goethe-numbered';

// import TestData from '../constants/thought-component-goethe.json';
import TestData from '../constants/data2.json';
// const TestData = {};
function prepareData(data) {
  return TestData.map(row => {
    return Object.entries(row).reduce((acc, [key, value]) => {
      acc[key] = Number(value) || 0;
      return acc;
    }, {});
  });
}

const preparedData = prepareData(TestData);
const DEFAULT_STATE = Immutable.fromJS({
  // DATA
  data: preparedData,
  sankeyData: generateCombinationCounts(preparedData.slice(0, 2)),
  timeSeriesData: prepTimeSeriesData(preparedData),
  sunburstData: prepSunburst(preparedData),
  waffleBookData: prepWaffleData(preparedData),
  // NOT DATA
  hoveredComment: null,
  lockedWaffle: false,
  showWafflebook: false
});

function setHoveredComment(state, payload) {
  if (!isFinite(payload) || (!payload && payload !== 0)) {
    return state
      .set('hoveredComment', null);
  }
  const row = state.getIn(['data', payload]).toJS();
  const cats = Object.keys(Object.entries(row).reduce((acc, [key, val]) => {
    if (!val || key === 'INDEX') {
      return acc;
    }
    acc[key] = true;
    return acc;
  }, {}));
  return state
    .set('hoveredComment', {
      sentence: GoetheNumberedSentences[payload],
      idx: payload,
      categories: cats
    });
}

function toggleLock(state) {
  return state.set('lockedWaffle', !state.get('lockedWaffle'));
}

function toggleWafflebookAndTimeseries(state) {
  return state.set('showWafflebook', !state.get('showWafflebook'));
}

const actionFuncMap = {
  'set-hovered-sentence': setHoveredComment,
  'toggle-lock': toggleLock,
  'toggle-waffle-plot-and-timeseries': toggleWafflebookAndTimeseries
};
const NULL_ACTION = (state, payload) => state;

export default createStore(
  combineReducers({
    base: (state = DEFAULT_STATE, {type, payload}) =>
      (actionFuncMap[type] || NULL_ACTION)(state, payload)
  }),
  applyMiddleware(thunk),
);
