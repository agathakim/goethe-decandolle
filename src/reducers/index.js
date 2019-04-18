import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {fromJS} from 'immutable';

import {
  generateCombinationCounts,
  prepTimeSeriesData,
  prepSunburst,
  prepWaffleData
} from './data-analysis-scripts';

const DEFAULT_STATE = fromJS({
  // DATA
  data: [],
  sankeyData: [],
  timeSeriesData: [],
  sunburstData: [],
  waffleBookData: [],
  numberedSents: [],
  // NOT DATA
  hoveredComment: null,
  lockedWaffle: false,
  showWafflebook: true,
  loading: true
});

function setHoveredComment(state, payload) {
  if (!isFinite(payload) || (!payload && payload !== 0)) {
    return state
      .set('hoveredComment', null);
  }

  const row = state.getIn(['data', payload]).toJS();
  const cats = Object.keys(Object.entries(row).reduce((acc, [key, val]) => {
    if (!val || key === 'index') {
      return acc;
    }
    acc[key] = true;
    return acc;
  }, {}));
  return state
    .set('hoveredComment', {
      sentence: state.getIn(['numberedSents', payload]),
      idx: payload,
      categories: cats
    });
}

const toggleLock = (state, payload) => state.set('lockedWaffle', !state.get('lockedWaffle'));
const toggleWafflebookAndTimeseries = (state, payload) =>
  state.set('showWafflebook', !state.get('showWafflebook'));

function recieveData(state, payload) {
  const {numberedSents, sentenceClassifcations} = payload;
  const data = sentenceClassifcations;
  return state
    .set('loading', false)
    .set('data', fromJS(data))
    .set('numberedSents', fromJS(numberedSents))
    .set('sankeyData', fromJS(generateCombinationCounts(data.slice(0, 2))))
    .set('timeSeriesData', fromJS(prepTimeSeriesData(data)))
    .set('sunburstData', fromJS(prepSunburst(data)))
    .set('waffleBookData', fromJS(prepWaffleData(data)));
}

const actionFuncMap = {
  'set-hovered-sentence': setHoveredComment,
  'toggle-lock': toggleLock,
  'toggle-waffle-plot-and-timeseries': toggleWafflebookAndTimeseries,
  'recieve-data': recieveData
};
const NULL_ACTION = (state, payload) => state;

export default createStore(
  combineReducers({
    base: (state = DEFAULT_STATE, {type, payload}) =>
      (actionFuncMap[type] || NULL_ACTION)(state, payload)
  }),
  applyMiddleware(thunk),
);
